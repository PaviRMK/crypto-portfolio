import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api"
});

/**
 * Axios request interceptor to attach Authorization header
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[API] Attaching Authorization header with token");
    } else {
      console.warn("[API] No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("[API] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Axios response interceptor to handle auth errors
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("[API] Unauthorized (401) - Token may be invalid or expired");
      localStorage.removeItem("token");
      localStorage.removeItem("userProfileCache");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;