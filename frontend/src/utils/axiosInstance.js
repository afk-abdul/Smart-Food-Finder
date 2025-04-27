import axios from "axios";

const accessToken = localStorage.getItem("access_token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/restaurants",
    headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        "Content-Type": "application/json"
    }
});

export default axiosInstance;