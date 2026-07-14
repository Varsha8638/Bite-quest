const express = require('express');
const { chromium } = require('playwright');
const db = require('./db');
const router = express.Router();

router.get('/:id/menu-images', async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await db.oneOrNone('SELECT menu_url FROM restaurants2 WHERE id = $1', [id]);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const { menu_url } = restaurant;
    if (!menu_url) {
      return res.status(400).json({ error: 'Menu URL is missing' });
    }

    let browser;
    try {
      browser = await chromium.launch();
      const page = await browser.newPage();

      await page.goto(menu_url, {
        waitUntil: 'networkidle',
        timeout: 60000,
      });

      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      await page.waitForTimeout(5000);

      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      });

      const imageUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));

        return images.map(img => {
          let src = img.getAttribute('src');
          const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');

          if (!src && dataSrc) {
            src = dataSrc;
          }

          return src;
        }).filter(src => src && src.includes('menus'));
      });

      if (imageUrls.length === 0) {
        console.log('No images found matching criteria.');
      }

      res.json({ images: imageUrls });
    } finally {
      // Always close the browser, even if the scrape above throws —
      // otherwise a failed scrape leaks a Chromium process every time.
      if (browser) await browser.close();
    }
  } catch (err) {
    console.error('Error fetching menu images:', err);
    res.status(500).json({ error: 'Failed to fetch menu images' });
  }
});

module.exports = router;
