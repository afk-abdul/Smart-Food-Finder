import { AuthContext } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserRestaurantFinderLayout from "./layout/UserRestaurantFinderLayout";
import RestaurantOwnerLayout from "./layout/RestaurantOwnerLayout";
function App() {
  const finderToken = localStorage.getItem("restaurantfinder_access_token");
  const ownerToken = localStorage.getItem("restaurantowner_access_token");

  const getDefaultRedirect = () => {
    if (ownerToken) return <Navigate to="/owner" replace />;
    if (finderToken) return <Navigate to="/home" replace />;
    return <Navigate to="/home" replace />;
  };
  const user = finderToken
    ? { type: "finder", token: finderToken }
    : ownerToken
    ? { type: "owner", token: ownerToken }
    : null;
  return (
    <AuthContext.Provider value={{ user }}>
      <Router>
        <Routes>
          {/* 1) Root: decide where to send them */}
          <Route path="/" element={getDefaultRedirect()} />

          {/* 2) Owner section (all /owner/* routes live inside this layout) */}
          <Route
            path="/owner/"
            element={<RestaurantOwnerLayout token={ownerToken} />}
          />

          {/* 3) Finder section (all /home/* routes live inside this layout) */}
          <Route
            path="/home/"
            element={<UserRestaurantFinderLayout token={finderToken} />}
          />

          {/* 4) Catch-all → back to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
