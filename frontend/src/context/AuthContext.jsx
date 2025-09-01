import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../axiosConfig";

const AuthCtx = createContext(null);

console.log("AuthContext loaded, baseURL:", api.defaults.baseURL);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/me");
      setUser(data?.data || null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signup = async ({ username, email, password, name }) => {
    const { data } = await api.post("/signup", {
      username,
      email,
      password,
      name,
    });
    setUser(data.data);
    return data.data;
  };

  const login = async ({ identifier, password }) => {
    console.log("API baseURL:", api.defaults.baseURL);
    const { data } = await api.post("/login", { identifier, password });
    setUser(data.data);
    return data.data;
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <AuthCtx.Provider
      value={{ user, ready, signup, login, logout, refetch: fetchMe }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
