import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../axiosConfig";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/me");
      setUser(data?.data || null);
    } catch (err) {
      console.error("Error fetching /me:", err);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signup = async ({ username, email, password, name }) => {
    await api.post("/signup", { username, email, password, name });
    await fetchMe();
  };

  const login = async ({ identifier, password }) => {
    await api.post("/login", { identifier, password });
    await fetchMe();
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    await fetchMe();
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
