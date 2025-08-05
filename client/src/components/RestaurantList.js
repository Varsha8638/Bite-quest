


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './RestaurantList.css';

// function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]); // Initialize as an empty array
//   const [filters, setFilters] = useState({
//     country: '',
//     minSpend: '',
//     maxSpend: '',
//     cuisines: '',
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null); // Add state for error handling

//   useEffect(() => {
//     fetchRestaurants();
//   }, [currentPage, filters]); // Fetch data on page or filter change

//   const fetchRestaurants = async () => {
//     setLoading(true);
//     setError(null); // Reset error on new fetch
//     try {
//       const response = await axios.get('http://localhost:5000/restaurants', {
//         params: { ...filters, page: currentPage },
//       });

//       // Check if response.data.restaurants is defined and an array
//       if (response.data && Array.isArray(response.data.restaurants)) {
//         setRestaurants(response.data.restaurants);
//         setTotalPages(response.data.totalPages);
//       } else {
//         console.error('Unexpected response structure:', response.data);
//         setRestaurants([]); // Fallback to empty array
//         setError('Unexpected response structure.'); // Set error message
//       }
//     } catch (error) {
//       console.error('Error fetching restaurants:', error);
//       setRestaurants([]); // Fallback to empty array
//       setError('Failed to fetch restaurants.'); // Set error message
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (event) => {
//     setFilters({
//       ...filters,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleFilterSubmit = (event) => {
//     event.preventDefault();
//     setCurrentPage(1); // Reset to page 1 when applying filters
//     fetchRestaurants();
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };
//   const countryOptions = [
//     'India', 'Australia', 'Brazil', 'Canada', 'Indonesia', 'New Zealand', 
//     'Philippines', 'Qatar', 'Singapore', 'South Africa', 'Sri Lanka', 
//     'Turkey', 'UAE', 'United Kingdom', 'United States'
//   ];

//   return (
//     <div className="restaurant-list">
//     <h2>Restaurant List</h2>

//     <form onSubmit={handleFilterSubmit} className="filter-form">
//       <div>
//         <label>Country:</label>
//         <select
//           name="country"
//           value={filters.country}
//           onChange={handleFilterChange}
//         >
//           <option value="">Select a country</option>
//           {countryOptions.map((country) => (
//             <option key={country} value={country}>
//               {country}
//             </option>
//           ))}
//         </select>
//       </div>
      
//         <div>
//           <label>Min Spend:</label>
//           <input
//             type="number"
//             name="minSpend"
//             value={filters.minSpend}
//             onChange={handleFilterChange}
//           />
//         </div>
//         <div>
//           <label>Max Spend:</label>
//           <input
//             type="number"
//             name="maxSpend"
//             value={filters.maxSpend}
//             onChange={handleFilterChange}
//           />
//         </div>
//         <div>
//           <label>Cuisines:</label>
//           <input
//             type="text"
//             name="cuisines"
//             value={filters.cuisines}
//             onChange={handleFilterChange}
//             placeholder="e.g. Italian, Chinese"
//           />
//         </div>
//         <button type="submit">Filter</button>
//       </form>

//       {loading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>} {/* Display error message */}

//       <ul>
//         {restaurants.length > 0 ? (
//           restaurants.map((restaurant) => (
//             <li key={restaurant.id}>
//               <a href={`/restaurants/${restaurant.id}`}>{restaurant.name}</a>
//             </li>
//           ))
//         ) : (
//           <p>No restaurants found.</p>
//         )}
//       </ul>

//       {/* Pagination Controls */}
//       <div className="pagination">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default RestaurantList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantList.css';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    minSpend: '',
    maxSpend: '',
    cuisines: '',
    searchName: '', // Add searchName to filters
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, filters]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/restaurants', {
        params: { ...filters, page: currentPage },
      });

      if (response.data && Array.isArray(response.data.restaurants)) {
        setRestaurants(response.data.restaurants);
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Unexpected response structure:', response.data);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchRestaurants();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="restaurant-list">
      <h2>Restaurant List</h2>

      <form onSubmit={handleFilterSubmit} className="filter-form">
        <div>
          <label>Search by Name:</label>
          <input
            type="text"
            name="searchName"
            value={filters.searchName}
            onChange={handleFilterChange}
            placeholder="Search by restaurant name"
          />
        </div>
        <div>
          <label>Country:</label>
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="Brazil">Brazil</option>
            <option value="Canada">Canada</option>
            <option value="Indonesia">Indonesia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Philippines">Philippines</option>
            <option value="Qatar">Qatar</option>
            <option value="Singapore">Singapore</option>
            <option value="South Africa">South Africa</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Turkey">Turkey</option>
            <option value="UAE">UAE</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>
        </div>
        <div>
          <label>Min Spend:</label>
          <input
            type="number"
            name="minSpend"
            value={filters.minSpend}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label>Max Spend:</label>
          <input
            type="number"
            name="maxSpend"
            value={filters.maxSpend}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label>Cuisines:</label>
          <input
            type="text"
            name="cuisines"
            value={filters.cuisines}
            onChange={handleFilterChange}
            placeholder="e.g. Italian, Chinese"
          />
        </div>
        <button type="submit">Filter</button>
      </form>

      {loading && <p>Loading...</p>}

      <ul>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <a href={`/restaurants/${restaurant.id}`}>{restaurant.name}</a>
            </li>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RestaurantList;
