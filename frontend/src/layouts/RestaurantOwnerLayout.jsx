import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RestaurantSignup from "./pages/restaurantsignup";
import BranchMap from "./pages/Map";
import ViewBranches from "./pages/ViewBranch";
import ViewNotifications from "./pages/notification";
import AuthPage from "./pages/userAuthentication";

import "./index.css";

function App() {
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
              element={
                <PrivateRoute>
                  <Dashboard setIsAuthenticated={setIsAuthenticated} />
                </PrivateRoute>
              }
            />
            <Route
              path="/menuitems"
              element={
                <PrivateRoute>
                  <MenuItems />
                </PrivateRoute>
              }
            />
            <Route
              path="/createdeal"
              element={
                <PrivateRoute>
                  <CreateDeal />
                </PrivateRoute>
              }
            />
            <Route
              path="/dealview"
              element={
                <PrivateRoute>
                  <DealsView />
                </PrivateRoute>
              }
            />
            <Route
              path="/branch"
              element={
                <PrivateRoute>
                  <Branch />
                </PrivateRoute>
              }
            />
            <Route
              path="/viewbranches"
              element={
                <PrivateRoute>
                  <ViewBranches />
                </PrivateRoute>
              }
            />
            <Route
              path="/viewnotifications"
              element={
                <PrivateRoute>
                  <ViewNotifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/branchmap"
              element={
                <PrivateRoute>
                  <BranchMap />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurants"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/auth"
              element={<AuthPage onAuthSuccess={handleAuthentication} />}
            />
            <Route path="/RestaurantSignup" element={<RestaurantSignup />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </Router>

  );
}