const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

/**
 * Service to handle restaurant-related API calls
 */
const restaurantService = {
  /**
   * Fetch all restaurants
   */
  getAllRestaurants: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  },

  /**
   * Get restaurant by ID with menu items, branches, and deals
   */
  getRestaurantById: async (id) => {
    try {
      const restaurantResponse = await fetch(
        `${API_BASE_URL}/restaurants/${id}/`
      );
      if (!restaurantResponse.ok)
        throw new Error(`HTTP error! Status: ${restaurantResponse.status}`);
      const restaurant = await restaurantResponse.json();

      // Menu items
      const menuRes = await fetch(
        `${API_BASE_URL}/menu-items/?restaurant_id=${id}`
      );
      restaurant.menuItems = menuRes.ok ? await menuRes.json() : [];

      // Branches
      const branchesRes = await fetch(
        `${API_BASE_URL}/branchs/?restaurant_id=${id}`
      );
      restaurant.branches = branchesRes.ok ? await branchesRes.json() : [];

      // Deals
      const dealsRes = await fetch(
        `${API_BASE_URL}/create-deal/?restaurant_id=${id}`
      );
      restaurant.deals = dealsRes.ok ? await dealsRes.json() : [];

      return restaurant;
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search restaurants
   */
  searchRestaurants: async (query) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurants/search/?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw error;
    }
  },

  /**
   * Get menu items by restaurant ID
   */
  getMenuItems: async (restaurantId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu-items/?restaurant_id=${restaurantId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching menu items for restaurant ${restaurantId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get branches by restaurant ID
   */
  getBranches: async (restaurantId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/branchs/?restaurant_id=${restaurantId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching branches for restaurant ${restaurantId}:`,
        error
      );
      throw error;
    }
  },
};

export default restaurantService;
