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
import PrivateRoute from "../components/PrivateRoute";
import CreateDeal from "../pages/restaurantOwner/Deal";

function RestauntOwnerLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        {isAuthenticated ? (
          <>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="menuitems" element={<PrivateRoute><MenuItems /></PrivateRoute>} />
          <Route path="createdeal" element={<PrivateRoute><CreateDeal /></PrivateRoute>} />
          <Route path="dealview" element={<PrivateRoute><DealsView /></PrivateRoute>} />
          <Route path="branch" element={<PrivateRoute><Branch /></PrivateRoute>} />
          <Route path="viewbranches" element={<PrivateRoute><ViewBranches /></PrivateRoute>} />
          <Route path="viewnotifications" element={<PrivateRoute><ViewNotifications /></PrivateRoute>} />
          <Route path="branchmap" element={<PrivateRoute><BranchMap /></PrivateRoute>} />
          </>
        ) : (
          <>
            <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="RestaurantSignup" element={<RestaurantSignup />} />
          </>
        )}
      </Routes>
      </>
  );
}


export default RestauntOwnerLayout;
