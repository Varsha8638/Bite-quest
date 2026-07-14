# 🏴‍☠️ BiteQuest

Set sail and discover restaurants — search by name, filter by country/cuisine/spend, find what's nearby by coordinates, or just snap a photo of a craving and let Gemini figure out what you're actually looking for.

**Live demo:**[ _Live_](https://bite-quest.vercel.app/)
**Repo:** https://github.com/Varsha8638/Bite-quest

## Tech Stack

- **Frontend:** React (Create React App), React Router, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL (`pg-promise`), Gemini API (visual food recognition), Playwright (menu-image scraping)
- **Deployment:** Vercel (frontend), Render (backend)

## Features

- Search restaurants by name, country, cuisine, or spend range, with pagination
- Location-based search — find restaurants within a radius of given coordinates
- **Visual Search** — upload a photo of food, Gemini identifies the likely cuisine categories, and matching restaurants are returned
- Restaurant detail page with an on-demand menu-image lookup (scrapes the restaurant's public menu page via Playwright)

## Project Structure

```
Bite-quest/
├── client/                    # React (CRA) frontend
│   └── src/
│       ├── components/         # LocationSearch, LocationResults, RestaurantList, RestaurantDetail, ImageUpload
│       ├── config.js            # API base URL (REACT_APP_API_URL)
│       └── App.js
└── server/                    # Express backend
    ├── db.js                    # Postgres connection (pg-promise)
    ├── index.js                  # Main routes: /restaurants, /restaurants/:id, /restaurants/location, /image-recog/upload
    ├── menuImages.js              # Playwright-based menu image scraper
    └── image_recog.js             # Gemini-based food image recognition
```

## Local Setup

### 1. Database

This app expects a Postgres database (`zomato_db`) with a `restaurants2` table populated from the [Zomato restaurants dataset](https://www.kaggle.com/datasets/shrutimehta/zomato-restaurants-data) (or equivalent), with at minimum these columns: `id`, `name`, `cuisines`, `average_cost_for_two`, `address`, `city`, `country_code`, `latitude`, `longitude`, `featured_image`, `menu_url`.

> ⚠️ The `country` filter queries a `country_code` column — if your table uses a different column name, update the query in `server/index.js` (`app.get('/restaurants', ...)`) to match.

### 2. Gemini API key

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey) for `GEMINI_API_KEY`.

### 3. Backend

```bash
cd server
cp .env.example .env   # fill in DB_HOST, DB_USER, DB_PASSWORD, GEMINI_API_KEY, etc.
npm install
npx playwright install chromium   # needed once, for the menu-image scraper
npm start                          # runs on http://localhost:5002
```

### 4. Frontend

```bash
cd client
cp .env.example .env   # fill in REACT_APP_API_URL
npm install
npm start                # runs on http://localhost:3000
```

## API Overview

| Method | Route | Description |
|---|---|---|
| GET | `/restaurants` | List restaurants with optional filters: `country`, `minSpend`, `maxSpend`, `cuisines`, `searchName`, `page` |
| GET | `/restaurants/:id` | Get one restaurant by ID |
| GET | `/restaurants/location?lat=&long=&radius=` | Find restaurants within `radius` km of given coordinates |
| GET | `/restaurants/:id/menu-images` | Scrapes the restaurant's `menu_url` for menu images (Playwright) |
| POST | `/image-recog/upload` | Upload an image (`multipart/form-data`, field `image`) — Gemini identifies likely cuisine categories, returns matching restaurants |

## Deployment

- **Backend → Render:** New Web Service, root directory `server`, build command `npm install && npx playwright install --with-deps chromium`, start command `npm start`. Add `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true`, `GEMINI_API_KEY` as environment variables. The Playwright browser install step is required — without it, the menu-image feature will fail on a fresh deploy since Chromium isn't bundled by default.
- **Frontend → Vercel:** Root directory `client`. Add `REACT_APP_API_URL` (your Render URL) as an environment variable. CRA-based apps also need an SPA rewrite — add a `vercel.json` in `client/` with a catch-all rewrite to `index.html`, same as any client-side-routed app, or direct navigation to routes like `/restaurants/5` will 404.

## Roadmap / Known Gaps

- The menu-image scraper depends on the target site's HTML structure (looks for `<img>` tags whose `src` contains `"menus"`) — it'll silently return zero images if a restaurant's menu page doesn't match that pattern.
- No rate limiting yet on `/image-recog/upload` — worth adding before this goes fully public, to protect the Gemini API quota.
- Playwright/Chromium is a genuinely heavier deploy than a typical Node API — expect slower cold starts on Render's free tier.
