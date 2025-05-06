// components/PrivateRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("RestaurantFinder_access_token");
  return token ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
