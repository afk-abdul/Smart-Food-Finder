"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import foodImage from "../../food.png";

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const isFieldActive = (field) => {
    return focusedField === field || formData[field] !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "http://127.0.0.1:8000/users/login/"
        : "http://127.0.0.1:8000/users/signup/";

      const dataToSend = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.access) {
          localStorage.setItem("RestaurantFinder_access_token", data.access);
        }
        if (data.refresh) {
          localStorage.setItem("RestaurantFinder_refresh_token", data.refresh);
        }

        if (onAuthSuccess) {
          onAuthSuccess();
        }

        navigate("/");
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen w-full bg-[#FDF6EC] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between rounded-3xl overflow-hidden">
        {/* Left section with illustration */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div className="max-w-md">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Find your favourite cuisine with a mere touch of the screen
            </h1>
          </div>

          {/* Food illustration image */}
          <div className="relative w-full h-64 md:h-80 mt-4 flex items-center justify-center">
            <img
              src={foodImage || "/placeholder.svg"}
              alt="Person browsing food options on laptop"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Right section with form - single white card */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end p-4 md:p-12">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="flex items-center mb-7">
              <div className="bg-orange-500 text-white p-2 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              <span className="text-lg font-bold text-gray-800">
                FoodFinder
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2 tracking-tight">
              {isLogin ? "Login to your account" : "Sign up for free"}
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              {isLogin ? "Welcome back!" : "Begin by creating an account today"}
            </p>

            {/* Form with consistent height */}
            <div className="min-h-[320px]">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => handleFocus("username")}
                      onBlur={handleBlur}
                      className="block w-full px-4 pb-2.5 pt-5 text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-500 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="username"
                      className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 
                        ${
                          isFieldActive("username")
                            ? "text-orange-500"
                            : "text-gray-500"
                        } 
                        peer-focus:text-orange-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-4`}
                    >
                      {isLogin ? "Username" : "Name"}
                    </label>
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus("email")}
                          onBlur={handleBlur}
                          className="block w-full px-4 pb-2.5 pt-5 text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-500 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="email"
                          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 
                            ${
                              isFieldActive("email")
                                ? "text-orange-500"
                                : "text-gray-500"
                            } 
                            peer-focus:text-orange-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                            peer-focus:scale-75 peer-focus:-translate-y-4`}
                        >
                          Email
                        </label>
                      </div>
                    </div>

                    {/* Phone field is hidden to match the screenshot but still in the form data */}
                    <div className="hidden">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      className="block w-full px-4 pb-2.5 pt-5 text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-500 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 
                        ${
                          isFieldActive("password")
                            ? "text-orange-500"
                            : "text-gray-500"
                        } 
                        peer-focus:text-orange-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-4`}
                    >
                      Password
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 text-sm mt-6 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  {loading ? <Loader /> : isLogin ? "Login" : "Create Account"}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={toggleAuthMode}
                  className="text-orange-500 font-medium hover:underline transition-colors duration-200"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
