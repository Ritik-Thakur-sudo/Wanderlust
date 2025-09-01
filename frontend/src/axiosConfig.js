import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

console.log("📡 Axios baseURL set to:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
