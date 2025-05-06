import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";

function FavoritesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [restaurants, setRestaurants] = useState({});

  // Authentication helper functions
  const getAuthToken = () =>
    localStorage.getItem("RestaurantFinder_access_token");
  const getRefreshToken = () =>
    localStorage.getItem("RestaurantFinder_refresh_token");

  const refreshToken = async () => {
    try {
      const refresh_token = getRefreshToken();
      if (!refresh_token) return null;

      const response = await axios.post(
        "http://127.0.0.1:8000/users/get-access-token/",
        { refresh_token: refresh_token }
      );

      const newAccessToken = response.data.access_token;
      localStorage.setItem("RestaurantFinder_access_token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const fetchWithAuth = async (
    url,
    setStateCallback,
    method = "GET",
    data = null
  ) => {
    let token = getAuthToken();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: method,
        url: url,
      };

      if (
        data &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        config.data = data;
      }

      const response = await axios(config);

      if (setStateCallback) {
        setStateCallback(response.data);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
              method: method,
              url: url,
            };

            if (
              data &&
              (method === "POST" || method === "PUT" || method === "PATCH")
            ) {
              config.data = data;
            }

            const retryResponse = await axios(config);

            if (setStateCallback) {
              setStateCallback(retryResponse.data);
            }
            return retryResponse.data;
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
        }
      } else {
        console.error("API error:", error);
      }
      return null;
    }
  };

  // Fetch all restaurants to get complete data
  const fetchRestaurants = async () => {
    const data = await fetchWithAuth(
      "http://127.0.0.1:8000/users/restaurant/",
      null
    );

    if (data) {
      // Convert array to object with id as key for easier lookup
      const restaurantsById = {};
      data.forEach((restaurant) => {
        restaurantsById[restaurant.id] = restaurant;
      });
      setRestaurants(restaurantsById);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Fetch favorites
      await fetchWithAuth(
        "http://127.0.0.1:8000/users/restaurant/favourites/",
        setFavorites
      );

      // Fetch all restaurants to get complete restaurant data
      await fetchRestaurants();

      setLoading(false);
    };

    loadData();

    // Save the current path to session storage
    sessionStorage.setItem("lastVisitedPage", location.pathname);
  }, [location.pathname]);

  const handleRemoveFavorite = async (restaurantId) => {
    try {
      await fetchWithAuth(
        `http://127.0.0.1:8000/users/restaurant/favourites/remove/${restaurantId}/`,
        null,
        "DELETE"
      );

      // Update the favorites list after removal
      setFavorites(
        favorites.filter((fav) => {
          // Handle different possible API response structures
          const favRestaurantId =
            fav.restaurant_id ||
            (fav.restaurant && typeof fav.restaurant === "object"
              ? fav.restaurant.id
              : fav.restaurant);

          return parseInt(favRestaurantId, 10) !== parseInt(restaurantId, 10);
        })
      );
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      alert("Failed to remove from favorites. Please try again.");
    }
  };

  const navigateToRestaurant = (restaurantId) => {
    if (restaurantId) {
      // Store the current page before navigating
      sessionStorage.setItem("lastVisitedPage", location.pathname);
      navigate(`/restaurants/${restaurantId}`, {
        state: { fromFavorites: true },
      });
    } else {
      console.error("Cannot navigate to restaurant: ID is undefined");
    }
  };

  // Function to get complete restaurant data
  const getRestaurantData = (restaurantId) => {
    return restaurants[restaurantId] || {};
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">
            Loading your favorites...
          </h2>
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          My Favorite Restaurants
        </h1>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((favorite) => {
              // Extract restaurant info based on API response structure
              const restaurantId =
                favorite.restaurant_id ||
                (favorite.restaurant && typeof favorite.restaurant === "object"
                  ? favorite.restaurant.id
                  : favorite.restaurant);

              // Get complete restaurant data
              const restaurant = getRestaurantData(restaurantId);

              // Fallback to favorite data if restaurant lookup fails
              const restaurantData = {
                ...favorite,
                ...(favorite.restaurant &&
                typeof favorite.restaurant === "object"
                  ? favorite.restaurant
                  : {}),
                ...restaurant,
              };

              // Skip rendering if we don't have a valid restaurant ID
              if (!restaurantId) {
                console.warn("Missing restaurant ID in favorite:", favorite);
                return null;
              }

              return (
                <div
                  key={favorite.id || `fav-${restaurantId}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigateToRestaurant(restaurantId)}
                >
                  <div className="flex cursor-pointer">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <img
                        src={restaurantData.image || "/api/placeholder/200/200"}
                        alt={restaurantData.name || "Restaurant"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 hover:text-orange-500">
                          {restaurantData.name || "Restaurant Name"}
                        </h3>
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 text-orange-500 fill-orange-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="ml-1">
                            {restaurantData.rating || "N/A"}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {restaurantData.cuisine || "Various Cuisine"}
                      </p>
                      <div className="mt-auto flex justify-between items-center pt-2">
                        <p className="text-gray-600 text-xs">
                          {restaurantData.address || "Address not available"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking remove button
                            handleRemoveFavorite(restaurantId);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-xl font-medium mb-4">
              You don't have any favorite restaurants yet
            </h2>
            <p className="text-gray-600 mb-6">
              Explore restaurants and click the heart icon to add them to your
              favorites.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              Explore Restaurants
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
