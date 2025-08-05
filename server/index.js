const express = require('express');
const db = require('./db');
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(require('cors')());
const menuImagesRouter = require('./menuImages');

const PORT = 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/restaurants', menuImagesRouter);
const { recognizeFood } = require('./image_recog');
// Start server

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

  // Get the page number from query or default to 1
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 10; // Number of restaurants to show per page
  const offset = (page - 1) * pageSize;

  try {
    // Recognize food from the uploaded image
    const categories = await recognizeFood(req.file.buffer);
    
    if (categories === 'NOT AVAILABLE') {
      return res.status(404).json({ error: 'No matching food categories found' });
    }

    // Split categories into an array, trimming any whitespace
    const categoryList = categories.split(',').map(cat => cat.trim());

    // Construct dynamic query with placeholders for each category
    const query = `
      SELECT * FROM restaurants2
      WHERE ${categoryList.map((_, i) => `cuisines ILIKE '%' || $${i + 1} || '%'`).join(' OR ')}
      LIMIT $${categoryList.length + 1} OFFSET $${categoryList.length + 2}
    `;

    // The parameter array includes categories followed by pageSize and offset
    const values = [...categoryList, pageSize, offset];

    // Execute the query
    const restaurants = await db.any(query, values);

    // Return the restaurants in the response
    res.json(restaurants);

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});



app.get('/restaurants/location', async (req, res) => {
  const { lat, long, radius } = req.query;

  // Log received parameters
  console.log(`Received Latitude: ${lat}, Longitude: ${long}, Radius: ${radius}`);

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

    console.log('Query Result:', restaurants);
    
    res.json(restaurants);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request for restaurant with ID: ${id}`); // Log request ID

  try {
    const restaurant = await db.oneOrNone('SELECT * FROM restaurants2 WHERE "id" = $1', [id]);
    console.log('Query result:', restaurant); // Log query result
    
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    console.error('Database error:', err); // Log any errors
    res.status(500).json({ error: 'Database error' });
  }
});



// Route to get menu details (placeholder route)
// app.get('/restaurants/:id/menu', async (req, res) => {
//   const { id } = req.params;
//   console.log(`Received request for menu details of restaurant with ID: ${id}`);

//   try {
//     // Replace with the actual SQL query to fetch menu details from your database
//     const menuDetails = await db.oneOrNone('SELECT * FROM menu WHERE restaurant_id = $1', [id]);
//     console.log('Menu details result:', menuDetails);
    
//     if (menuDetails) {
//       res.json(menuDetails);
//     } else {
//       res.status(404).json({ message: 'Menu details not found' });
//     }
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// app.get('/restaurants', async (req, res) => {
//   const page = parseInt(req.query.page, 10) || 1;
//   const pageSize = 10;
//   const offset = (page - 1) * pageSize;

//   // Define a mapping of country names to their codes
//   const countryCodeMap = {
//     'India': 1,
//     'Australia': 14,
//     'Brazil': 30,
//     'Canada': 37,
//     'Indonesia': 94,
//     'New Zealand': 148,
//     'Philippines': 162,
//     'Qatar': 166,
//     'Singapore': 184,
//     'South Africa': 189,
//     'Sri Lanka': 191,
//     'Turkey': 208,
//     'UAE': 214,
//     'United Kingdom': 215,
//     'United States': 216
//   };

//   const country = req.query.country || null;
//   const minSpend = req.query.minSpend || null;
//   const maxSpend = req.query.maxSpend || null;
//   const cuisines = req.query.cuisines || null;
//   const searchName = req.query.searchName || null;

//   // Convert country to code if provided
//   const countryCode = country ? countryCodeMap[country] : null;

//   let query = `SELECT * FROM restaurants2 WHERE TRUE`;
//   const values = [];
//   let paramIndex = 1;

//   // Append conditions based on filters
//   if (searchName) {
//     query += ` AND name ILIKE $${paramIndex++}`;
//     values.push(`%${searchName}%`);
//   }
//   if (countryCode) {
//         query += ` AND country ILIKE $${countryCode}`;
//         paramIndex++
//         values.push(`%${countryCode}%`);
//       }
//   if (minSpend) {
//     query += ` AND average_cost_for_two >= $${paramIndex++}`;
//     values.push(minSpend);
//   }
//   if (maxSpend) {
//     query += ` AND average_cost_for_two <= $${paramIndex++}`;
//     values.push(maxSpend);
//   }
//   if (cuisines) {
//     const cuisineArray = cuisines.split(',').map(c => c.trim());
//     query += ` AND (${cuisineArray.map((_, idx) => `cuisines ILIKE '%' || $${paramIndex++} || '%'`).join(' OR ')})`;
//     values.push(...cuisineArray);
//   }

//   // Count the total number of records matching the filters
//   const countQuery = query.replace(/SELECT \* FROM restaurants2 WHERE TRUE/, 'SELECT COUNT(*) FROM restaurants2 WHERE TRUE');
//   try {
//     const countResult = await db.one(countQuery, values);
//     const totalRecords = parseInt(countResult.count, 10);
//     const totalPages = Math.ceil(totalRecords / pageSize);

//     // Add LIMIT and OFFSET to the query
//     query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
//     values.push(pageSize, offset);

//     const result = await db.any(query, values);
//     res.json({ restaurants: result, totalPages });
//   } catch (error) {
//     console.error('Error fetching restaurants:', error);
//     res.status(500).json({ error: 'Failed to fetch restaurants' });
//   }
// });

app.get('/restaurants', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Define a mapping of country names to their codes
  const countryCodeMap = {
    'India': 1,
    'Australia': 14,
    'Brazil': 30,
    'Canada': 37,
    'Indonesia': 94,
    'New Zealand': 148,
    'Philippines': 162,
    'Qatar': 166,
    'Singapore': 184,
    'South Africa': 189,
    'Sri Lanka': 191,
    'Turkey': 208,
    'UAE': 214,
    'United Kingdom': 215,
    'United States': 216
  };

  const country = req.query.country || null;
  const minSpend = req.query.minSpend || null;
  const maxSpend = req.query.maxSpend || null;
  const cuisines = req.query.cuisines || null;
  const searchName = req.query.searchName || null;

  // Convert country to code if provided
  const countryCode = country ? countryCodeMap[country] : null;

  // Start building the query
  let query = `SELECT * FROM restaurants2 WHERE TRUE`;
  const values = [];
  let paramIndex = 1;

  // Append conditions based on filters
  if (searchName) {
    query += ` AND name ILIKE $${paramIndex++}`;
    values.push(`%${searchName}%`);
  }
  if (countryCode) {
            query += ` AND country ILIKE $${countryCode}`;
            paramIndex++
            values.push(`%${countryCode}%`);
          }
  if (minSpend) {
    query += ` AND average_cost_for_two>= $${paramIndex++}`;
    values.push(minSpend);
  }
  if (maxSpend) {
    query += ` AND average_cost_for_two <= $${paramIndex++}`;
    values.push(maxSpend);
  }
  if (cuisines) {
    const cuisineArray = cuisines.split(',').map(c => c.trim());
    query += ` AND (${cuisineArray.map((_, idx) => `cuisines ILIKE '%' || $${paramIndex++} || '%'`).join(' OR ')})`;
    values.push(...cuisineArray);
  }

  // Count the total number of records matching the filters
  const countQuery = query.replace(/SELECT \* FROM restaurants2 WHERE TRUE/, 'SELECT COUNT(*) FROM restaurants2 WHERE TRUE');
  try {
    const countResult = await db.one(countQuery, values);
    const totalRecords = parseInt(countResult.count, 10);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Add LIMIT and OFFSET to the query
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
