import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/restaurantFinder/HomePage";
import RestaurantPage from "../pages/restaurantFinder/RestaurantPage";

function UserRestaurantFinderLayout({ findertoken }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (findertoken) {
      const access_token = localStorage.getItem(
        "restaurantfinder_access_token"
      );
      if (access_token) {
        setIsAuthenticated(true);
      }
    }
  }, [findertoken]);

  return <HomePage></HomePage>;
}

export default UserRestaurantFinderLayout;
