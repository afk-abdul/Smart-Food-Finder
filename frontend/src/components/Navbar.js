import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated }) {
  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Restaurant Login</Link></li>
            <li><Link to="/RestaurantSignup">Restaurant Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

