import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Existing page imports
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RestaurantSignup from "./pages/restaurantsignup";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import PrivateRoute from "./components/PrivateRoute";
import MenuItems from "./pages/MenuItems";
import CreateDeal from "./pages/Deal";
import DealsView from "./pages/DealView";
import Branch from "./pages/Branch";
import BranchMap from "./pages/Map";
import ViewBranches from "./pages/ViewBranch";
import ViewNotifications from "./pages/notification";
import AuthPage from "./pages/userAuthentication";

// Restaurant finder page imports
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";

// Styles
import "./index.css";

// Create Authentication Context for sharing auth state
export const AuthContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authSource, setAuthSource] = useState(null); // Track login source

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("accessToken");
      const source = localStorage.getItem("auth_source");

      if (token) {
        setIsAuthenticated(true);
        setAuthSource(source);

        try {
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Handle successful authentication
  const handleAuthentication = (userData, source = "default") => {
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    localStorage.setItem("auth_source", source);
    setAuthSource(source);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("auth_source");
    setIsAuthenticated(false);
    setUser(null);
    setAuthSource(null);
  };

  // Auth context value
  const authContextValue = {
    isAuthenticated,
    user,
    setIsAuthenticated,
    handleAuthentication,
    handleLogout,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDF6EC]">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        {isAuthenticated && authSource !== "auth" && (
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        )}
        <Routes>
          {isAuthenticated ? (
            authSource === "auth" ? (
              <>
                {/* Only restaurant finder routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/restaurants/:id" element={<RestaurantPage />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            ) : (
              <>
                {/* Full access routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/restaurants/:id" element={<RestaurantPage />} />
                <Route path="/original-home" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Dashboard setIsAuthenticated={setIsAuthenticated} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/menuitems"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <MenuItems />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/createdeal"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <CreateDeal />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dealview"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <DealsView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/branch"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Branch />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/viewbranches"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <ViewBranches />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/viewnotifications"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <ViewNotifications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/branchmap"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <BranchMap />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/restaurants-dashboard"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            )
          ) : (
            <>
              <Route
                path="/login"
                element={
                  <Login
                    setIsAuthenticated={(user) =>
                      handleAuthentication(user, "login")
                    }
                  />
                }
              />
              <Route
                path="/auth"
                element={
                  <AuthPage
                    onAuthSuccess={(user) => handleAuthentication(user, "auth")}
                  />
                }
              />
              <Route
                path="/RestaurantSignup"
                element={
                  <RestaurantSignup
                    onSignupSuccess={(user) =>
                      handleAuthentication(user, "signup")
                    }
                  />
                }
              />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
