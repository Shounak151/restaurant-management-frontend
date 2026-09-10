import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the token (user or admin) to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tastybites_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it so the app falls back to logged-out state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("tastybites_token");
      localStorage.removeItem("tastybites_user");
    }
    return Promise.reject(error);
  }
);

export default api;
