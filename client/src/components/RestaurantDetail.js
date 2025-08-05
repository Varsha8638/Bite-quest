import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './RestaurantDetail.css'; // Import the CSS file

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuImages, setMenuImages] = useState([]);
  const [loadingMenuImages, setLoadingMenuImages] = useState(false);

  useEffect(() => {
    // Fetch restaurant details
    axios.get(`http://localhost:5000/restaurants/${id}`)
      .then(response => {
        console.log('Data fetched:', response.data);
        setRestaurant(response.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, [id]);

  const fetchMenuImages = async () => {
    if (restaurant && restaurant["id"]) {
      setLoadingMenuImages(true);
      try {
        const response = await axios.get(`http://localhost:5000/restaurants/${id}/menu-images`);
        console.log('Menu images fetched:', response.data.images);
        setMenuImages(response.data.images);
      } catch (error) {
        console.error('Error fetching menu images:', error);
      } finally {
        setLoadingMenuImages(false);
      }
    } else {
      console.error('No restaurant ID found');
    }
  };

  if (!restaurant) return <p className="loading">Loading...</p>;

  return (
    <div className="restaurant-detail-container">
      <h1 className="restaurant-name">{restaurant["name"] ? restaurant["name"] : 'No Name Available'}</h1>
      
      {/* Display restaurant image */}
      {restaurant["featured_image"] && (
        <img
          src={restaurant["featured_image"]}
          alt={`${restaurant["name"]} Image`}
          className="featured-image"
        />
      )}
      
      <p className="restaurant-info">Cuisines: {restaurant["cuisines"] ? restaurant["cuisines"] : 'No Cuisines Available'}</p>
      <p className="restaurant-info">Average Cost for Two: {restaurant["average_cost_for_two"] ? restaurant["average_cost_for_two"] : 'No Cost Info Available'}</p>
      <p className="restaurant-info">Address: {restaurant["address"] ? restaurant["address"] : 'No Address Available'}</p>
      <p className="restaurant-info">City: {restaurant["city"] ? restaurant["city"] : 'No City Info Available'}</p>
      
      {/* Menu Images Section */}
      <div className="menu-images-section">
        <button className="fetch-button" onClick={fetchMenuImages} disabled={loadingMenuImages}>
          {loadingMenuImages ? 'Loading Menu Images...' : 'Show Menu Images'}
        </button>
        
        {menuImages.length > 0 && (
          <div className="menu-images-container">
            <h2 className="menu-images-title">Menu Images</h2>
            <div className="menu-images-grid">
              {menuImages.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Menu Item ${index}`}
                  className="menu-image"
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
