import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationSearch from './components/LocationSearch';
import LocationResults from './components/LocationResults';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-parchment-50 bg-map-texture bg-map-grid">
        <header className="bg-ocean-800 border-b-4 border-treasure-500 shadow-lg">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl">🏴‍☠️</span>
              <h1 className="font-display text-4xl sm:text-5xl text-treasure-400 tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                BiteQuest
              </h1>
            </Link>
            <nav className="flex gap-2 sm:gap-3">
              <Link
                to="/"
                className="px-4 py-2 rounded-md bg-ocean-700 text-treasure-200 font-body font-semibold hover:bg-ocean-600 hover:text-treasure-100 transition-colors border border-ocean-600"
              >
                🧭 Home
              </Link>
              <Link
                to="/restaurants"
                className="px-4 py-2 rounded-md bg-ocean-700 text-treasure-200 font-body font-semibold hover:bg-ocean-600 hover:text-treasure-100 transition-colors border border-ocean-600"
              >
                🗺️ Filter
              </Link>
              <Link
                to="/upload"
                className="px-4 py-2 rounded-md bg-ocean-700 text-treasure-200 font-body font-semibold hover:bg-ocean-600 hover:text-treasure-100 transition-colors border border-ocean-600"
              >
                🔭 Visual Search
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<LocationSearch />} />
            <Route path="/restaurants/location" element={<LocationResults />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/upload" element={<ImageUpload />} />
          </Routes>
        </main>

        <footer className="text-center text-ocean-600 font-body text-sm py-8">
          ⚓ Every great meal starts with a map. Happy hunting.
        </footer>
      </div>
    </Router>
  );
}

export default App;
