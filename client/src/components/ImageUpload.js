import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    setError(null);
    setSearched(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      setLoading(true);
      const result = await axios.post(`${API_BASE_URL}/image-recog/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRestaurants(result.data);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err?.response?.data?.error || 'Could not process this image. Please try again.');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl border-2 border-treasure-400 shadow-lg p-6">
        <h2 className="font-display text-3xl text-ocean-800 mb-1">🔭 Spyglass Search</h2>
        <p className="font-body text-sm text-ocean-500 mb-4">
          Snap a photo of your craving — we'll chart a course to matching spots.
        </p>

        <form onSubmit={handleImageUpload} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            required
            className="w-full font-body text-sm text-ocean-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-ocean-700 file:text-treasure-200 file:font-semibold hover:file:bg-ocean-600 file:cursor-pointer"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-treasure-500 hover:bg-treasure-600 text-ocean-900 font-display text-xl tracking-wide rounded-md py-2 shadow transition-colors disabled:opacity-50"
          >
            {loading ? '🌊 Scanning the seas...' : '🏴‍☠️ Upload Image'}
          </button>
        </form>

        {error && (
          <p className="font-body text-flagred-600 bg-flagred-50 border border-flagred-500 rounded-md px-4 py-2 mt-4">
            {error}
          </p>
        )}
      </div>

      {restaurants.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border-2 border-ocean-200 shadow p-6">
          <h3 className="font-display text-2xl text-ocean-800 mb-3">🏝️ Treasure Found</h3>
          <ul className="space-y-2">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="block bg-parchment-50 border-2 border-ocean-100 hover:border-treasure-400 rounded-md px-4 py-3 font-body font-semibold text-ocean-800 transition-colors"
                >
                  {restaurant.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searched && !loading && !error && restaurants.length === 0 && (
        <p className="font-body text-ocean-500 italic mt-6 text-center">
          No matching treasure this time — try another image.
        </p>
      )}
    </div>
  );
}

export default ImageUpload;
