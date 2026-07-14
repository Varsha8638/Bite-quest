import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [menuImages, setMenuImages] = useState([]);
  const [loadingMenuImages, setLoadingMenuImages] = useState(false);
  const [menuError, setMenuError] = useState(null);

  useEffect(() => {
    setRestaurant(null);
    setNotFound(false);
    axios.get(`${API_BASE_URL}/restaurants/${id}`)
      .then(response => {
        setRestaurant(response.data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setNotFound(true);
      });
  }, [id]);

  const fetchMenuImages = async () => {
    if (restaurant && restaurant["id"]) {
      setLoadingMenuImages(true);
      setMenuError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/restaurants/${id}/menu-images`);
        setMenuImages(response.data.images);
      } catch (error) {
        console.error('Error fetching menu images:', error);
        setMenuError('Could not fetch the menu images for this spot.');
      } finally {
        setLoadingMenuImages(false);
      }
    }
  };

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto text-center font-body text-ocean-700">
        <p className="text-5xl mb-3">🗺️</p>
        <p>No treasure found at this location — that restaurant doesn't exist.</p>
      </div>
    );
  }

  if (!restaurant) {
    return <p className="text-center font-body text-ocean-600">Unrolling the map...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border-2 border-treasure-400 shadow-lg overflow-hidden">
      {restaurant["featured_image"] && (
        <img
          src={restaurant["featured_image"]}
          alt={restaurant["name"]}
          className="w-full h-56 object-cover"
        />
      )}

      <div className="p-6">
        <h1 className="font-display text-4xl text-ocean-800 mb-3">
          {restaurant["name"] || 'No Name Available'}
        </h1>

        <div className="font-body text-ocean-700 space-y-1 mb-6">
          <p>🍽️ Cuisines: {restaurant["cuisines"] || 'No Cuisines Available'}</p>
          <p>💰 Average Cost for Two: {restaurant["average_cost_for_two"] || 'No Cost Info Available'}</p>
          <p>📍 Address: {restaurant["address"] || 'No Address Available'}</p>
          <p>🏙️ City: {restaurant["city"] || 'No City Info Available'}</p>
        </div>

        <button
          onClick={fetchMenuImages}
          disabled={loadingMenuImages}
          className="bg-treasure-500 hover:bg-treasure-600 text-ocean-900 font-display text-xl tracking-wide rounded-md px-5 py-2 shadow transition-colors disabled:opacity-50"
        >
          {loadingMenuImages ? '🔭 Scouting Menu...' : '🔭 Show Menu Images'}
        </button>

        {menuError && <p className="font-body text-flagred-600 mt-3">{menuError}</p>}

        {menuImages.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-2xl text-ocean-800 mb-3">Menu Treasures</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {menuImages.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Menu Item ${index}`}
                  className="w-full h-28 object-cover rounded-md border-2 border-ocean-100"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
