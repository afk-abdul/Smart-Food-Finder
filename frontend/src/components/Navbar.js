import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated }) {
  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/owner/">Home</Link></li>
            <li><Link to="/owner/dashboard">Dashboard</Link></li>
            <li><Link to="/owner/menuitems">MenuItems</Link></li>
            <li><Link to="/owner/createdeal">MakeDeal</Link></li>
            <li><Link to="/owner/dealview">DealView</Link></li>
            <li><Link to="/owner/branch">Branches</Link></li>
            <li><Link to="/owner/viewbranches">ViewBranches</Link></li>
            <li><Link to="/owner/viewnotifications">ViewNotifications</Link></li>
            <li><Link to="/owner/branchmap">Map</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/owner/login">Restaurant Login</Link></li>
            <li><Link to="/owner/RestaurantSignup">Restaurant Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

