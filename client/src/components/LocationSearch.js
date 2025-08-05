import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationSearch.css';

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

  return (
    <div className="location-search">
      <h2>Search Restaurants by Location</h2>
      <div className="input-group">
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="text"
          id="latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="text"
          id="longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="radius">Radius (km):</label>
        <input
          type="text"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
      </div>
      <button onClick={handleLocationSearch}>Search by Location</button>

      <h2>Search Restaurants by ID</h2>
      <div className="input-group">
        <label htmlFor="searchId">Restaurant ID:</label>
        <input
          type="text"
          id="searchId"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>
      <button onClick={handleSearchById}>Search by ID</button>
    </div>
  );
};

export default LocationSearch;
