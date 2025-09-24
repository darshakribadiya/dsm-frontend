"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { LoadingScreen } from "../_components/loading-screen";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    refreshUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{loading ? <LoadingScreen /> : children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
