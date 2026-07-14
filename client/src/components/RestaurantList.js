import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    minSpend: '',
    maxSpend: '',
    cuisines: '',
    searchName: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants`, {
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

  const inputClass = "w-full rounded-md border-2 border-ocean-100 focus:border-treasure-500 focus:outline-none px-3 py-2 font-body text-ocean-800";
  const labelClass = "block font-body font-semibold text-ocean-700 mb-1 text-sm";

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="font-display text-3xl text-ocean-800 mb-1">📜 The Treasure Ledger</h2>
      <p className="font-body text-ocean-500 mb-6">Narrow the hunt by name, port of origin, coin, or cuisine.</p>

      <form onSubmit={handleFilterSubmit} className="bg-white rounded-xl border-2 border-treasure-400 shadow-lg p-6 grid sm:grid-cols-2 gap-4 mb-8">
        <div className="sm:col-span-2">
          <label className={labelClass}>Search by Name</label>
          <input
            className={inputClass}
            type="text"
            name="searchName"
            value={filters.searchName}
            onChange={handleFilterChange}
            placeholder="Search by restaurant name"
          />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <select className={inputClass} name="country" value={filters.country} onChange={handleFilterChange}>
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
          <label className={labelClass}>Cuisines</label>
          <input
            className={inputClass}
            type="text"
            name="cuisines"
            value={filters.cuisines}
            onChange={handleFilterChange}
            placeholder="e.g. Italian, Chinese"
          />
        </div>
        <div>
          <label className={labelClass}>Min Spend (💰)</label>
          <input className={inputClass} type="number" name="minSpend" value={filters.minSpend} onChange={handleFilterChange} />
        </div>
        <div>
          <label className={labelClass}>Max Spend (💰)</label>
          <input className={inputClass} type="number" name="maxSpend" value={filters.maxSpend} onChange={handleFilterChange} />
        </div>
        <button
          type="submit"
          className="sm:col-span-2 bg-treasure-500 hover:bg-treasure-600 text-ocean-900 font-display text-xl tracking-wide rounded-md py-2 shadow transition-colors"
        >
          🏴‍☠️ Set Sail
        </button>
      </form>

      {loading && <p className="font-body text-ocean-600 mb-4">Charting the waters...</p>}

      <ul className="space-y-3">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <a
                href={`/restaurants/${restaurant.id}`}
                className="block bg-white border-2 border-ocean-100 hover:border-treasure-400 rounded-lg px-5 py-4 shadow hover:shadow-lg hover:-translate-y-0.5 transition-all font-body font-semibold text-ocean-800"
              >
                {restaurant.name}
              </a>
            </li>
          ))
        ) : (
          !loading && <p className="font-body text-ocean-500 italic">No treasure found. Try adjusting your map.</p>
        )}
      </ul>

      <div className="flex items-center justify-center gap-4 mt-8 font-body">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-ocean-700 text-treasure-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ocean-600 transition-colors"
        >
          ◀ Previous
        </button>
        <span className="text-ocean-700 font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-ocean-700 text-treasure-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ocean-600 transition-colors"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default RestaurantList;
