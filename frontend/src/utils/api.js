import axios from 'axios';

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" }
});

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    const response = await API.post("/restaurants/get-access-token/", { refresh: refresh_token });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// Axios request interceptor to attach token
API.interceptors.request.use(async (config) => {
  let access_token = localStorage.getItem("access_token");
  config.headers.Authorization = access_token ? `Bearer ${access_token}` : "";
  
  return config;
}, (error) => Promise.reject(error));

// Axios response interceptor to refresh token if expired
API.interceptors.response.use(response => response, async (error) => {
  if (error.response && error.response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      error.config.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(error.config);  // Retry request with new token
    }
  }
  return Promise.reject(error);
});

export default API;
