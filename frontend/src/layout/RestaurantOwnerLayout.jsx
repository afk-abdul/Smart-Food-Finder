import React, { useState, useEffect, createContext } from "react";
import
{
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
import { Button } from "../components/ui/button";

import
{
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Link } from 'react-router-dom';

import Login from "../pages/restaurantOwner/Login";
import RestaurantSignup from "../pages/restaurantOwner/restaurantsignup";
import BranchMap from "../pages/restaurantOwner/Map";
import ViewBranches from "../pages/restaurantOwner/ViewBranch";
import ViewNotifications from "../pages/restaurantOwner/notification";
import Home from "../pages/restaurantOwner/home";
import MenuItems from "../pages/restaurantOwner/MenuItems";
import DealsView from "../pages/restaurantOwner/DealView";
import Branch from "../pages/restaurantOwner/Branch";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import CreateDeal from "../pages/restaurantOwner/Deal";
import AuthPage from "../pages/restaurantOwner/Auth";

export const AuthContext = createContext(null);

function RestauntOwnerLayout()
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() =>
    {
        const token = localStorage.getItem("access_token")

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
            {isAuthenticated ? (
                <div className="min-h-screen bg-[#FFF8EE]">
                    {/* Header */}
                    <header className="bg-white shadow-sm py-4 px-6">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="bg-orange-500 p-2 rounded-lg mr-3">
                                    <ShoppingBag className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">FoodFinder</h2>
                            </div>
                            <div className="flex items-center space-x-4">
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
                    </header>

                    {/* Sidebar and Main Content */}
                    <div className="flex max-w-7xl mx-auto">
                        {/* Sidebar */}
                        <aside className="w-64 bg-white shadow-sm p-6 h-[calc(100vh-72px)] sticky top-[72px]">
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <Link to="/owner/" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/menuitems" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700 ">
                                            Menu Items
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/createdeal" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Make Deal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/dealview" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Deal View
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/branch" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Branches
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/viewbranches" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            View Branches
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/viewnotifications" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            View Notifications
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/branchmap" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Map
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>
                        <Routes>
                            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="menuitems" element={<PrivateRoute><MenuItems /></PrivateRoute>} />
                            <Route path="createdeal" element={<PrivateRoute><CreateDeal /></PrivateRoute>} />
                            <Route path="dealview" element={<PrivateRoute><DealsView /></PrivateRoute>} />
                            <Route path="branch" element={<PrivateRoute><Branch /></PrivateRoute>} />
                            <Route path="viewbranches" element={<PrivateRoute><ViewBranches /></PrivateRoute>} />
                            <Route path="viewnotifications" element={<PrivateRoute><ViewNotifications /></PrivateRoute>} />
                            <Route path="branchmap" element={<PrivateRoute><BranchMap /></PrivateRoute>} />
                            <Route path="branchmap" element={<PrivateRoute><BranchMap /></PrivateRoute>} />
                        </Routes>
                    </div>
                </div>

            ) : (
                <Routes>
                    <Route path="/" element={<Navigate to="login" replace />} />
                    <Route path="login" element={<AuthPage />} />
                </Routes>
            )}
        </AuthContext.Provider>
    );
}


export default RestauntOwnerLayout;
