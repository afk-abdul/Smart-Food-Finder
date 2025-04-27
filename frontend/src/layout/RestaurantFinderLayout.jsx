import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/restaurantFinder/HomePage";
import RestaurantPage from "../pages/restaurantFinder/RestaurantPage";
import AuthPage from "../pages/restaurantFinder/userAuthentication";


export const AuthContext = createContext(null);

function RestaurantFinderLayout()
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() =>
    {
        const token = localStorage.getItem("RestaurantFinder_access_token")

        if (token)
        {
            setIsAuthenticated(true);
            try
            {
                const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                setUser(userData);
            } catch (e)
            {
                console.error("User data error:", e);
            }
        }

        setIsLoading(false);
    }, []);

    const handleAuthentication = (userData) =>
    {
        setIsAuthenticated(true);
        if (userData)
        {
            localStorage.setItem("userData", JSON.stringify(userData));
            setUser(userData);
        }
    };

    const handleLogout = () =>
    {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
    };

    const authContextValue = {
        isAuthenticated,
        user,
        handleAuthentication,
        handleLogout,
    };

    if (isLoading)
    {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/restaurants/:id" element={<RestaurantPage />} />
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </>
                ) : (
                    <>
                        <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthentication} />} />
                        <Route path="*" element={<Navigate to="/auth" replace />} />
                    </>
                )}
            </Routes>
        </AuthContext.Provider>
    );
}

export default RestaurantFinderLayout;
