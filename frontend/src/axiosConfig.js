import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
});

console.log("axiosConfig baseURL:", api.defaults.baseURL);

export default api;
