"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  Heart,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Link } from "react-router-dom";

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [branches, setBranches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [similarRestaurants, setSimilarRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

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

  // Check if restaurant is in favorites
  const checkFavoriteStatus = async (restaurantId) => {
    try {
      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/users/restaurant/favourites/`,
        null
      );

      if (response && Array.isArray(response)) {
        // Ensure we're using the same data type for comparison
        const restaurantIdInt = parseInt(restaurantId, 10);

        // Debug log to see what's coming back from the API
        console.log("Favorites data:", response);

        // Check if any favorite matches the current restaurant ID
        const isFavorite = response.some((fav) => {
          // Handle different possible API response structures
          const favId = fav.id ? parseInt(fav.id, 10) : null;
          const favRestaurantId = fav.restaurant_id
            ? parseInt(fav.restaurant_id, 10)
            : null;
          const favRestaurant = fav.restaurant
            ? typeof fav.restaurant === "object"
              ? fav.restaurant.id
                ? parseInt(fav.restaurant.id, 10)
                : null
              : parseInt(fav.restaurant, 10)
            : null;

          // Log each comparison for debugging
          console.log(
            `Comparing: Current=${restaurantIdInt}, Fav ID=${favId}, RestaurantID=${favRestaurantId}, Restaurant=${favRestaurant}`
          );

          // Check all possible ID locations
          return (
            favId === restaurantIdInt ||
            favRestaurantId === restaurantIdInt ||
            favRestaurant === restaurantIdInt
          );
        });

        console.log(`Restaurant ${restaurantId} is favorite: ${isFavorite}`);
        setIsLiked(isFavorite);
      } else {
        console.log("No favorites data or unexpected format:", response);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Failed to check favorite status:", error);
      setIsLiked(false);
    }
  };

  // Fetch restaurant data
  useEffect(() => {
    const loadRestaurantData = async () => {
      setLoading(true);

      // Check first if user is authenticated
      const token = getAuthToken();
      if (!token) {
        console.log("User not authenticated, skipping favorite check");
        setIsLiked(false);
      } else {
        // Check if this restaurant is in user's favorites first
        await checkFavoriteStatus(id);
      }

      // Fetch restaurant details
      const restaurantData = await fetchWithAuth(
        `http://127.0.0.1:8000/users/restaurant/${id}/`,
        setRestaurant
      );

      if (restaurantData) {
        // Fetch branches
        fetchWithAuth(
          `http://127.0.0.1:8000/users/restaurant/${id}/branches/`,
          setBranches
        );

        // Fetch menu items
        fetchWithAuth(
          `http://127.0.0.1:8000/users/restaurant/${id}/menu-items/`,
          setMenuItems
        );

        // Fetch deals
        fetchWithAuth(
          `http://127.0.0.1:8000/users/restaurant/${id}/deals/`,
          setDeals
        );

        // Fetch similar restaurants
        fetchWithAuth(
          `http://127.0.0.1:8000/users/restaurant/similar/${id}/`,
          setSimilarRestaurants
        );
      }

      setLoading(false);
    };

    if (id) {
      loadRestaurantData();
    }
  }, [id]);

  const handleLikeToggle = async () => {
    const newLikedState = !isLiked; // compute new state
    setIsLiked(newLikedState); // update UI immediately (optimistic)

    try {
      if (newLikedState) {
        // Call API to add to favorites
        const result = await addToFavorites(id);
        console.log("Add to favorites result:", result);

        // Verify the state actually changed by checking favorites again
        await checkFavoriteStatus(id);
      } else {
        // Call API to remove from favorites
        const result = await removeFromFavorites(id);
        console.log("Remove from favorites result:", result);

        // Verify the state actually changed by checking favorites again
        await checkFavoriteStatus(id);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      // Revert the state if API fails
      setIsLiked(!newLikedState);

      // Show an error message to the user
      alert("Failed to update favorite status. Please try again.");
    }
  };

  const addToFavorites = async (restaurantId) => {
    // Ensure we're sending the correct restaurant ID
    const parsedId = parseInt(restaurantId, 10);

    // Using POST method for adding to favorites
    return await fetchWithAuth(
      `http://127.0.0.1:8000/users/restaurant/favourites/add/${parsedId}/`,
      null,
      "POST",
      { restaurant_id: parsedId }
    );
  };

  const removeFromFavorites = async (restaurantId) => {
    // Ensure we're sending the correct restaurant ID
    const parsedId = parseInt(restaurantId, 10);

    // Using DELETE method for removing from favorites
    return await fetchWithAuth(
      `http://127.0.0.1:8000/users/restaurant/favourites/remove/${parsedId}/`,
      null,
      "DELETE"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">
            Loading restaurant information...
          </h2>
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
          <Button
            onClick={() => navigate("/")}
            className="bg-gray-900 hover:bg-gray-800 rounded-lg"
          >
            Go back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF6EC]">
      {/* Header Image */}
      <div className="relative h-64 md:h-96 w-full">
        <img
          src={restaurant.image || "/api/placeholder/600/400"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="absolute top-4 left-4 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              <p className="text-gray-600">{restaurant.cuisine}</p>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Star className="h-5 w-5 text-orange-500 mr-1 fill-orange-500" />
              <span className="font-medium">{restaurant.rating || "N/A"}</span>
              <span className="text-gray-500 ml-1">
                ({restaurant.review_count || 0})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center text-gray-700">
              <Clock className="h-4 w-4 text-orange-500 mr-1" />
              {restaurant.opening_hours || "Hours not available"}
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 text-orange-500 mr-1" />
              {restaurant.address || "Address not available"}
            </div>
            {restaurant.phone && (
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 text-orange-500 mr-1" />
                {restaurant.phone}
              </div>
            )}
            {restaurant.website && (
              <div className="flex items-center text-gray-700">
                <Globe className="h-4 w-4 text-orange-500 mr-1" />
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500"
                >
                  Website
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            <Button className="bg-gray-900 hover:bg-gray-800 rounded-lg flex-1">
              Reserve a table
            </Button>
            <Button
              variant="outline"
              className={`rounded-lg border-gray-200 ${
                isLiked ? "bg-orange-100" : ""
              }`}
              onClick={handleLikeToggle}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked
                    ? "fill-orange-500 text-orange-500"
                    : "text-orange-500"
                }`}
              />
              <span className="sr-only">
                {isLiked ? "Unfavorite" : "Favorite"}
              </span>
            </Button>

            <Button variant="outline" className="rounded-lg border-gray-200">
              <Share2 className="h-5 w-5 text-orange-500" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="outline" className="rounded-lg border-gray-200">
              <BookmarkPlus className="h-5 w-5 text-orange-500" />
              <span className="sr-only">Save</span>
            </Button>
          </div>

          <Tabs
            defaultValue="menu"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="branches">Branches</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Menu Items Tab */}
            <TabsContent value="menu" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    {item.image && (
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/api/placeholder/200/200"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="font-medium">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No menu items available</p>
              )}
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Special Deals</h2>
              {deals.length > 0 ? (
                deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-orange-700">
                        {deal.name}
                      </h3>
                      <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Save {deal.discount_percentage}%
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{deal.description}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      {deal.valid_from && deal.valid_to ? (
                        <p>
                          Valid from{" "}
                          {new Date(deal.valid_from).toLocaleDateString()} to{" "}
                          {new Date(deal.valid_to).toLocaleDateString()}
                        </p>
                      ) : (
                        <p>Limited time offer</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No special deals available at the moment
                </p>
              )}
            </TabsContent>

            {/* Branches Tab */}
            <TabsContent value="branches" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Locations</h2>
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="border-b border-gray-100 pb-4 mb-4 last:border-0"
                  >
                    <h3 className="font-medium">
                      {branch.name || `${restaurant.name} - ${branch.location}`}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 text-orange-500 mr-1" />
                        {branch.address}
                      </div>
                      {branch.phone && (
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 text-orange-500 mr-1" />
                          {branch.phone}
                        </div>
                      )}
                      {branch.opening_hours && (
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 text-orange-500 mr-1" />
                          {branch.opening_hours}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No branch information available</p>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 mb-4 last:border-0"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">
                          {review.user_name || "Anonymous"}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-orange-500 fill-orange-500 mr-1" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <div className="text-gray-500 text-xs mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No reviews yet</p>
                    <Button className="bg-orange-500 hover:bg-orange-600 rounded-lg">
                      Be the first to review
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Restaurants */}
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-bold mb-4">Similar Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similarRestaurants && similarRestaurants.length > 0 ? (
              similarRestaurants.slice(0, 2).map((similarRestaurant) => (
                <Link
                  to={`/restaurants/${similarRestaurant.id}`}
                  key={similarRestaurant.id}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <img
                        src={
                          similarRestaurant.image || "/api/placeholder/200/200"
                        }
                        alt={similarRestaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">
                          {similarRestaurant.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-orange-500 fill-orange-500 mr-1" />
                          <span className="text-xs">
                            {similarRestaurant.rating || "N/A"}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {similarRestaurant.cuisine}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {similarRestaurant.distance ||
                          similarRestaurant.address}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">
                No similar restaurants found
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default RestaurantPage;
