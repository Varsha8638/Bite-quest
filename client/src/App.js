// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import LocationSearch from 'C:/Users/smart/OneDrive/Desktop/Zomato-listing/my-app/client/src/components/LocationSearch.js';
// import RestaurantList from 'C:/Users/smart/OneDrive/Desktop/Zomato-listing/my-app/client/src/components/RestaurantList.js';
// import RestaurantDetail from 'C:/Users/smart/OneDrive/Desktop/Zomato-listing/my-app/client/src/components/RestaurantDetail.js';
// import './App.css';


// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <header className="App-header">
//           <h1>Restaurant Finder</h1>
//           <nav>
//             <Link to="/">Home</Link>
//             <Link to="/restaurants">Restaurant List</Link>
//           </nav>
//         </header>

//         <main>
//           <Routes>
//             <Route path="/" element={<LocationSearch />} />
//             <Route path="/restaurants" element={<RestaurantList />} />
//             <Route path="/restaurants/:id" element={<RestaurantDetail />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LocationSearch from './components/LocationSearch';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import ImageUpload from './components/ImageUpload'; // Import the new component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Food spot finder</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/restaurants">Filter</Link>
            <Link to="/upload">Visual Search</Link> {/* Add link to new page */}
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LocationSearch />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/upload" element={<ImageUpload />} /> {/* Add route for new page */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
