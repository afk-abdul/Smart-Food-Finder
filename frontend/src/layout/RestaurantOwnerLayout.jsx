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
import BranchForm from "../pages/restaurantOwner/Branches/AddBranch";
import Branches from "../pages/restaurantOwner/Branches/Branches";
import ViewNotifications from "../pages/restaurantOwner/notification";
import Home from "../pages/restaurantOwner/home";
import MenuItems from "../pages/restaurantOwner/MenuItems";
import DealsView from "../pages/restaurantOwner/DealView";
import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";
import CreateDeal from "../pages/restaurantOwner/MakeDeal";
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
                        <aside className="w-64 bg-white shadow-sm p-6 h-[calc(100vh)] sticky top-0">
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
                                        <Link to="/owner/deals" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Deals
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/owner/branches" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Branches
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/owner/viewnotifications" className="block py-2 px-4 rounded hover:bg-[#FFF8EE] text-gray-700">
                                            Notifications
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>
                        <Routes>
                            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="menuitems" element={<PrivateRoute><MenuItems /></PrivateRoute>} />
                            <Route path="deals" element={<PrivateRoute><DealsView /></PrivateRoute>} />
                            <Route path="create-deal" element={<PrivateRoute><CreateDeal /></PrivateRoute>} />
                            <Route path="branches" element={<PrivateRoute><Branches /></PrivateRoute>} />
                            <Route path="create-branch" element={<PrivateRoute><BranchForm /></PrivateRoute>} />
                            <Route path="viewnotifications" element={<PrivateRoute><ViewNotifications /></PrivateRoute>} />
                            <Route path="branchmap" element={<PrivateRoute><BranchMap /></PrivateRoute>} />
                            <Route path="branchmap" element={<PrivateRoute><BranchMap /></PrivateRoute>} />
                        </Routes>
                    </div>
                </div>

            ) : (
                <Routes>
                    <Route path="*" element={<Navigate to="login" replace />} />
                    <Route path="login" element={<AuthPage onAuthSuccess={handleAuthentication} />} />
                </Routes>
            )}
        </AuthContext.Provider>
    );
}


export default RestauntOwnerLayout;
