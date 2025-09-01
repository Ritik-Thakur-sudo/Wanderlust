import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

if (import.meta.env.PROD && baseURL.includes("localhost")) {
  throw new Error(
    "VITE_BACKEND_URL is not set in production! Falling back to localhost would break cookies."
  );
}

console.log("Axios baseURL set to:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
