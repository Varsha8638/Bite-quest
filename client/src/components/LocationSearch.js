import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LocationSearch = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const handleLocationSearch = () => {
    if (latitude && longitude && radius) {
      navigate(`/restaurants/location?lat=${latitude}&long=${longitude}&radius=${radius}`);
    }
  };

  const handleSearchById = () => {
    if (searchId) {
      navigate(`/restaurants/${searchId}`);
    }
  };

  const inputClass = "w-full rounded-md border-2 border-ocean-100 focus:border-treasure-500 focus:outline-none px-3 py-2 font-body text-ocean-800";
  const labelClass = "block font-body font-semibold text-ocean-700 mb-1";

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="bg-white rounded-xl border-2 border-treasure-400 shadow-lg p-6">
        <h2 className="font-display text-3xl text-ocean-800 mb-1">🧭 Chart Your Course</h2>
        <p className="font-body text-sm text-ocean-500 mb-4">Mark your coordinates to find nearby fare.</p>

        <div className="space-y-3">
          <div>
            <label className={labelClass} htmlFor="latitude">Latitude</label>
            <input className={inputClass} type="text" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="longitude">Longitude</label>
            <input className={inputClass} type="text" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="radius">Radius (km)</label>
            <input className={inputClass} type="text" id="radius" value={radius} onChange={(e) => setRadius(e.target.value)} />
          </div>
          <button
            onClick={handleLocationSearch}
            className="w-full mt-2 bg-treasure-500 hover:bg-treasure-600 text-ocean-900 font-display text-xl tracking-wide rounded-md py-2 shadow transition-colors"
          >
            ⚓ Search by Location
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-ocean-200 shadow p-6">
        <h2 className="font-display text-2xl text-ocean-800 mb-1">🔎 Know Its Name?</h2>
        <p className="font-body text-sm text-ocean-500 mb-4">Jump straight to a restaurant by ID.</p>
        <div>
          <label className={labelClass} htmlFor="searchId">Restaurant ID</label>
          <input className={inputClass} type="text" id="searchId" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        </div>
        <button
          onClick={handleSearchById}
          className="w-full mt-3 bg-ocean-700 hover:bg-ocean-600 text-treasure-200 font-display text-xl tracking-wide rounded-md py-2 shadow transition-colors"
        >
          🗺️ Search by ID
        </button>
      </div>
    </div>
  );
};

export default LocationSearch;
