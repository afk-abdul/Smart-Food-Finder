import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RestaurantSignup from './pages/restaurantsignup';
import Navbar from './components/Navbar';
import Home from './pages/home'
import PrivateRoute from './components/PrivateRoute';
import MenuItems from './pages/MenuItems';
import CreateDeal from './pages/Deal'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard setIsAuthenticated={setIsAuthenticated} /></PrivateRoute>} />
            <Route path="/menuitems" element={<PrivateRoute><MenuItems /></PrivateRoute>} /> 
            <Route path="/createdeal" element={<PrivateRoute><CreateDeal /></PrivateRoute>} /> 
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/RestaurantSignup" element={<RestaurantSignup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;