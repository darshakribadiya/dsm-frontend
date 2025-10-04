"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { LoadingScreen } from "@/components/loading-screen";
import { normalizeEntitlements, normalizeUser } from "./user-config";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [entitlements, setEntitlements] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser();
        setUser(normalizeUser(userData));
        setEntitlements(normalizeEntitlements(userData));

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
    setUser(normalizeUser(userData));
    setEntitlements(normalizeEntitlements(userData));  };

  const clearUser = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    setUser,
    refreshUser,
    clearUser,
    entitlements, setEntitlements,
  };

  return (
    <UserContext.Provider value={value}>
      {loading ? <LoadingScreen loadingText={"Loading..."} /> : children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
