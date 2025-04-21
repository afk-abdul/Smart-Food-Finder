"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { restaurants } from "../data/restaurant";
import { Link } from "react-router-dom";

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === id);
  const [activeTab, setActiveTab] = useState("menu");

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
          src={restaurant.image || "https://via.placeholder.com/600x400"}
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
              <span className="font-medium">{restaurant.rating}</span>
              <span className="text-gray-500 ml-1">
                ({restaurant.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center text-gray-700">
              <Clock className="h-4 w-4 text-orange-500 mr-1" />
              {restaurant.openingHours}
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 text-orange-500 mr-1" />
              {restaurant.address}
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 text-orange-500 mr-1" />
              {restaurant.phone}
            </div>
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
            <Button variant="outline" className="rounded-lg border-gray-200">
              <Heart className="h-5 w-5 text-orange-500" />
              <span className="sr-only">Favorite</span>
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
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
            <TabsContent value="menu" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Popular Items</h2>
              {restaurant.menu.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg"
                >
                  {item.image && (
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.image || "https://via.placeholder.com/200x200"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                {restaurant.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 mb-4 last:border-0"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{review.name}</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-orange-500 fill-orange-500 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                    <div className="text-gray-500 text-xs mt-2">
                      {review.date}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="info">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-gray-700">{restaurant.description}</p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Location</h2>
                  <p className="text-gray-700">{restaurant.address}</p>
                  <div className="mt-2 h-48 bg-gray-200 rounded-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Map view would appear here
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Hours</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {restaurant.hours.map((hour, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{hour.day}</span>
                        <span className="text-gray-700">{hour.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Restaurants */}
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-bold mb-4">Similar Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants
              .filter(
                (r) =>
                  r.cuisine === restaurant.cuisine && r.id !== restaurant.id
              )
              .slice(0, 2)
              .map((similarRestaurant) => (
                <Link
                  to={`/restaurants/${similarRestaurant.id}`}
                  key={similarRestaurant.id}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <img
                        src={
                          similarRestaurant.image ||
                          "https://via.placeholder.com/200x200"
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
                            {similarRestaurant.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {similarRestaurant.cuisine}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {similarRestaurant.distance}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default RestaurantPage;
