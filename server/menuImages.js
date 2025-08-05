const express = require('express');
const { chromium } = require('playwright');
const db = require('./db'); // Import your database module
const fs = require('fs'); // For file system access
const router = express.Router();

router.get('/:id/menu-images', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch API key and menu URL from the database
    const restaurant = await db.oneOrNone('SELECT apikey, menu_url FROM restaurants2 WHERE id = $1', [id]);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { apikey, menu_url } = restaurant;
    if (!menu_url) {
      return res.status(400).json({ error: 'Menu URL is missing' });
    }

    // Launch Playwright Chromium browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the menu URL
    await page.goto(menu_url, {
      waitUntil: 'networkidle',
      timeout: 60000, // 60 seconds timeout
    });

    // Scroll the page to ensure lazy-loaded images are rendered
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    // Wait for lazy-loaded images to load (adjust timeout if needed)
    await page.waitForTimeout(5000);
    
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      });
      
    // Extract the HTML and save it to a file for reference
    const html = await page.content();
    fs.writeFileSync('menu_page.html', html, 'utf8');

    // Extract image URLs, including handling lazy-loaded images
    const imageUrls = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));

      return images.map(img => {
        let src = img.getAttribute('src');
        const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src'); // Handle lazy-loading

        if (!src && dataSrc) {
          src = dataSrc; // Use data-src if src is empty (lazy loading case)
        }

        return src;
      }).filter(src => src && src.includes('menus')); // Filter for relevant menu images
    });

    // Close the browser
    await browser.close();

    if (imageUrls.length === 0) {
      console.log('No images found matching criteria.');
    }

    res.json({ images: imageUrls });
  } catch (err) {
    console.error('Error fetching menu images:', err);
    res.status(500).json({ error: 'Failed to fetch menu images' });
  }
});

module.exports = router;
