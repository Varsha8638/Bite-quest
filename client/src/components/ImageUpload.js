

// import React, { useState } from 'react';
// import axios from 'axios';
// import './ImageUpload.css';

// function ImageUpload() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [response, setResponse] = useState(null);

//   const handleImageUpload = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('image', selectedImage);

//     try {
//       const result = await axios.post('http://localhost:5000/image-recog/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setResponse(result.data);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   return (
//     <div className="image-upload">
//       <h2>Upload an Image for Food Recognition</h2>
//       <form onSubmit={handleImageUpload}>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setSelectedImage(e.target.files[0])}
//           required
//         />
//         <button type="submit">Upload Image</button>
//       </form>
//       {response && (
//         <div>
//           <h3>Results:</h3>
//           <pre>{JSON.stringify(response, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImageUpload;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './ImageUpload.css'; // Update your CSS file for better styling

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const result = await axios.post('http://localhost:5000/image-recog/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRestaurants(result.data); // Assuming result.data is the list of restaurants
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="image-upload">
      <h2>Food Recognition</h2>
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          required
        />
        <button type="submit">Upload Image</button>
      </form>

      {restaurants.length > 0 && (
        <div className="restaurant-list">
          <h3>Restaurants Found:</h3>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
