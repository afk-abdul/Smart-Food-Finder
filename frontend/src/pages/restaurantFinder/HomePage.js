"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Search,
  Star,
  LogOut,
  User,
  ShoppingBag,
  MapPin,
  Clock,
  Utensils,
  ArrowUp,
  X,
  DollarSign,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Slider } from "../../components/ui/slider";
import { restaurants } from "../../data/restaurant"; // Using the correct import path
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([1, 3]); // 1=$, 2=$$, 3=$$$
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const { user, handleLogout } = useContext(AuthContext); // idar change karli

  // Generate all possible search suggestions
  const allSuggestions = [
    ...new Set([
      ...restaurants.map((r) => r.name),
      ...restaurants.map((r) => r.cuisine),
      ...restaurants.flatMap((r) => r.tags || []),
    ]),
  ];

  // Filter restaurants based on search, cuisine filter, and price range
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.tags &&
        restaurant.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    // Cuisine filter
    const matchesFilter =
      activeFilter === "all" || restaurant.cuisine === activeFilter;

    // Price range filter
    const priceSymbols = restaurant.priceRange?.length || 1;
    const matchesPriceRange =
      priceSymbols >= priceRange[0] && priceSymbols <= priceRange[1];

    return matchesSearch && matchesFilter && matchesPriceRange;
  });

  const cuisineTypes = ["all", ...new Set(restaurants.map((r) => r.cuisine))];

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allSuggestions
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);

      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Format price range for display
  const formatPriceRange = (range) => {
    return Array(range).fill("$").join("");
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Hero Section with Illustrations */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FDF6EC] to-[#FFE8CC] pt-8 pb-12">
        {/* Food doodles - top left */}
        <div className="absolute top-10 left-10 w-24 h-24 text-orange-500 opacity-20 transform -rotate-12">
          <Utensils className="w-full h-full" />
        </div>

        {/* Food doodles - top right */}
        <div className="absolute top-20 left-0 w-full h-20 text-orange-500 opacity-20 transform rotate-12 flex justify-end pr-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with user info */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg mr-3">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">FoodFinder</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center text-sm text-gray-600 mr-2 bg-white px-3 py-2 rounded-full shadow-sm">
                <User className="h-4 w-4 mr-1 text-orange-500" />
                <span>{user?.name || "User"}</span>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-orange-200 hover:bg-orange-100"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2 text-orange-500" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
            <div className="max-w-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Find your favorite cuisine with a mere touch
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Discover the best restaurants near you, browse menus, and find
                your next delicious meal.
              </p>

              {/* Search Section with Suggestions */}
              <div ref={searchRef} className="relative">
                <div className="bg-white rounded-full p-2 shadow-lg flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                    <Input
                      placeholder="Search restaurants, cuisines..."
                      className="pl-10 border-none rounded-full focus:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() =>
                        searchQuery.length > 1 && setShowSuggestions(true)
                      }
                    />
                    {searchQuery && (
                      <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 rounded-full ml-2">
                    <Search className="h-5 w-5 text-white" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                    <ul className="py-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSuggestions(false);
                            }}
                          >
                            <Search className="h-4 w-4 text-orange-500 mr-2" />
                            <span>{suggestion}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="rounded-full border-orange-200 bg-white hover:bg-orange-100"
                >
                  <Camera className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Image Search</span>
                </Button>

                {/* Price Range Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-orange-200 bg-white hover:bg-orange-100"
                    >
                      <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
                      <span>
                        Price: {formatPriceRange(priceRange[0])} -{" "}
                        {formatPriceRange(priceRange[1])}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Price Range</h4>
                      <div className="pt-4">
                        <Slider
                          defaultValue={priceRange}
                          min={1}
                          max={3}
                          step={1}
                          onValueChange={setPriceRange}
                          className="mb-6"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>$</span>
                          <span>$$</span>
                          <span>$$$</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative w-full max-w-sm">
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-200 rounded-full opacity-30 -z-10"></div>
              <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full opacity-40 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Wave divider - Fixed z-index and positioning */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#FDF6EC"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
              transform="rotate(180 720 60)"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Popular Cuisines
          </h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent justify-start">
              {cuisineTypes.map((cuisine) => (
                <TabsTrigger
                  key={cuisine}
                  value={cuisine}
                  onClick={() => setActiveFilter(cuisine)}
                  className="rounded-full px-4 py-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white capitalize shadow-sm"
                >
                  {cuisine}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* No results message */}
        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-8">
            <div className="text-orange-500 mb-2">
              <Search className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">
              No restaurants found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Restaurant Grid with Skeleton Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? // Skeleton loading state
              Array(6)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-orange-100"
                  >
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex justify-between mb-3">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))
            : // Actual restaurant cards
              filteredRestaurants.map((restaurant) => (
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  key={restaurant.id}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-orange-100">
                    <div className="relative h-48 w-full">
                      <img
                        src={
                          restaurant.image ||
                          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop"
                        }
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {restaurant.isNew && (
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          NEW
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-xl text-white">
                          {restaurant.name}
                        </h3>
                        <p className="text-orange-200 text-sm">
                          {restaurant.cuisine}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-orange-500 mr-1" />
                          <span>{restaurant.distance}</span>
                        </div>
                        <div className="flex items-center bg-orange-100 px-2 py-1 rounded-lg">
                          <Star className="h-4 w-4 text-orange-500 mr-1 fill-orange-500" />
                          <span className="text-sm font-medium">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        <span>{restaurant.openingHours || "Open Now"}</span>
                        <span className="mx-2">•</span>
                        <span>{restaurant.priceRange}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.tags &&
                          restaurant.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-orange-50 text-orange-800 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose FoodFinder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Find Nearby Restaurants
              </h3>
              <p className="text-gray-600">
                Discover the best dining options close to your location with
                real-time availability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Image Search</h3>
              <p className="text-gray-600">
                Take a photo of food you like and we'll find restaurants serving
                similar dishes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from real customers to make informed
                dining decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-orange-50 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-orange-500 p-2 rounded-lg mr-3">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">FoodFinder</h2>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-orange-500">
                About Us
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodFinder. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default HomePage;
