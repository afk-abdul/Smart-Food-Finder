import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RestaurantFinderLayout from "./layout/RestaurantFinderLayout";
import RestaurantOwnerLayout from "./layout/RestaurantOwnerLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/owner/*" element={<RestaurantOwnerLayout />} />

        <Route path="/*" element={<RestaurantFinderLayout />} />
        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
