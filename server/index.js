const express = require('express');
const db = require('./db');
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(require('cors')());
const menuImagesRouter = require('./menuImages');
const { recognizeFood } = require('./image_recog');

const PORT = process.env.PORT || 5002;

app.use(express.urlencoded({ extended: true }));
app.use('/restaurants', menuImagesRouter);

app.get('/test-db', async (req, res) => {
  try {
    await db.any('SELECT NOW() AS now');
    res.send('Database connection is successful!');
  } catch (err) {
    res.status(500).send(`Database connection failed: ${err.message}`);
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/image-recog/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  try {
    const categories = await recognizeFood(req.file.buffer);

    if (categories === 'NOT AVAILABLE') {
      return res.status(404).json({ error: 'No matching food categories found' });
    }

    const categoryList = categories.split(',').map(cat => cat.trim());

    const query = `
      SELECT * FROM restaurants2
      WHERE ${categoryList.map((_, i) => `cuisines ILIKE '%' || $${i + 1} || '%'`).join(' OR ')}
      LIMIT $${categoryList.length + 1} OFFSET $${categoryList.length + 2}
    `;

    const values = [...categoryList, pageSize, offset];
    const restaurants = await db.any(query, values);

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.get('/restaurants/location', async (req, res) => {
  const { lat, long, radius } = req.query;

  if (!lat || !long || !radius) {
    return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
  }

  try {
    const restaurants = await db.any(`
      SELECT * FROM (
        SELECT *,
        ( 6371 * acos( cos( radians($1::numeric) ) * cos( radians("latitude"::numeric) ) *
        cos( radians("longitude"::numeric) - radians($2::numeric) ) + sin( radians($1::numeric) ) *
        sin( radians("latitude"::numeric) ) ) ) AS distance
        FROM restaurants2
      ) AS restaurant_data
      WHERE distance < $3::numeric
      ORDER BY distance
    `, [lat, long, radius]);

    res.json(restaurants);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await db.oneOrNone('SELECT * FROM restaurants2 WHERE "id" = $1', [id]);

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/restaurants', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const countryCodeMap = {
    'India': 1, 'Australia': 14, 'Brazil': 30, 'Canada': 37, 'Indonesia': 94,
    'New Zealand': 148, 'Philippines': 162, 'Qatar': 166, 'Singapore': 184,
    'South Africa': 189, 'Sri Lanka': 191, 'Turkey': 208, 'UAE': 214,
    'United Kingdom': 215, 'United States': 216,
  };

  const country = req.query.country || null;
  const minSpend = req.query.minSpend || null;
  const maxSpend = req.query.maxSpend || null;
  const cuisines = req.query.cuisines || null;
  const searchName = req.query.searchName || null;

  const countryCode = country ? countryCodeMap[country] : null;

  let query = `SELECT * FROM restaurants2 WHERE TRUE`;
  const values = [];
  let paramIndex = 1;

  if (searchName) {
    query += ` AND name ILIKE $${paramIndex++}`;
    values.push(`%${searchName}%`);
  }
  // Was previously interpolating countryCode straight into the SQL string as
  // "$${countryCode}" (e.g. "$216"), which is not a valid bound parameter for
  // most countries and also desynced every placeholder index after it.
  if (countryCode) {
    query += ` AND country_code = $${paramIndex++}`;
    values.push(countryCode);
  }
  if (minSpend) {
    query += ` AND average_cost_for_two >= $${paramIndex++}`;
    values.push(minSpend);
  }
  if (maxSpend) {
    query += ` AND average_cost_for_two <= $${paramIndex++}`;
    values.push(maxSpend);
  }
  if (cuisines) {
    const cuisineArray = cuisines.split(',').map(c => c.trim());
    query += ` AND (${cuisineArray.map(() => `cuisines ILIKE '%' || $${paramIndex++} || '%'`).join(' OR ')})`;
    values.push(...cuisineArray);
  }

  const countQuery = query.replace(/SELECT \* FROM restaurants2 WHERE TRUE/, 'SELECT COUNT(*) FROM restaurants2 WHERE TRUE');

  try {
    const countResult = await db.one(countQuery, values);
    const totalRecords = parseInt(countResult.count, 10);
    const totalPages = Math.ceil(totalRecords / pageSize);

    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    values.push(pageSize, offset);

    const result = await db.any(query, values);
    res.json({ restaurants: result, totalPages });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
