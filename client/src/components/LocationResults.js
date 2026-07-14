import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const LocationResults = () => {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const long = searchParams.get('long');
  const radius = searchParams.get('radius');

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !long || !radius) {
      setError('Missing latitude, longitude, or radius.');
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.get(`${API_BASE_URL}/restaurants/location`, { params: { lat, long, radius } })
      .then(response => {
        setRestaurants(response.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching nearby restaurants:', err);
        setError('Could not fetch nearby restaurants. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [lat, long, radius]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="font-display text-3xl text-ocean-800 mb-2">🗺️ Charted Waters</h2>
      <p className="font-body text-ocean-600 mb-6">
        Spots within {radius}km of your marked coordinates.
      </p>

      {loading && <p className="font-body text-ocean-600">Scanning the horizon...</p>}
      {error && <p className="font-body text-flagred-600 bg-flagred-50 border border-flagred-500 rounded-md px-4 py-2">{error}</p>}

      {!loading && !error && (
        restaurants.length > 0 ? (
          <ul className="space-y-3">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="block bg-white border-2 border-treasure-400 rounded-lg px-5 py-4 shadow hover:shadow-lg hover:-translate-y-0.5 transition-transform font-body"
                >
                  <span className="font-bold text-ocean-800">{restaurant.name}</span>
                  {restaurant.distance && (
                    <span className="ml-2 text-sm text-treasure-600">
                      · {Number(restaurant.distance).toFixed(1)} km away
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-ocean-600 italic">No treasure found in these waters. Try widening your radius.</p>
        )
      )}
    </div>
  );
};

export default LocationResults;
