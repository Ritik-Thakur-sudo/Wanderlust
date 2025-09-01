import { useEffect, useState } from "react";
import api from "../axiosConfig";

export default function useMe() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/me");
        setUser(data?.data || null);
      } catch (err) {
        console.error("Error fetching /me:", err);
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    fetchMe();
  }, []);

  return { user, ready };
}
