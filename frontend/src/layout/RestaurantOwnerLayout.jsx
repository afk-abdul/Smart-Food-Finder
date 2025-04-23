import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/restaurantOwner/Login";
import Dashboard from "../pages/restaurantOwner/Dashboard";
import RestaurantSignup from "../pages/restaurantOwner/restaurantsignup";
import BranchMap from "../pages/restaurantOwner/Map";
import ViewBranches from "../pages/restaurantOwner/ViewBranch";
import ViewNotifications from "../pages/restaurantOwner/notification";
import Home from "../pages/restaurantOwner/home";
import MenuItems from "../pages/restaurantOwner/MenuItems";
import DealsView from "../pages/restaurantOwner/DealView";
import Branch from "../pages/restaurantOwner/Branch";
import Navbar from "../components/Navbar";
function RestauntOwnerLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={<Dashboard setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/menuitems" element={<MenuItems />} />
            <Route path="/dealview" element={<DealsView />} />
            <Route path="/branch" element={<Branch />} />
            <Route path="/viewbranches" element={<ViewBranches />} />
            <Route path="/viewnotifications" element={<ViewNotifications />} />
            <Route path="/branchmap" element={<BranchMap />} />
            <Route path="/restaurants" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/RestaurantSignup" element={<RestaurantSignup />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default RestauntOwnerLayout;
