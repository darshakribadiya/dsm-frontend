"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { LoadingScreen } from "@/components/loading-screen";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (userData) => {
    if (!userData) return null;
    const role = userData.role || "user";
    const permissions = userData.permissions || [];
    const entitlements = {
      isSensitiveVisible: role === "admin",
    };

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      isAdmin: userData.user_type == "admin" ? true :false,
      role,
      permissions,
      entitlements,
    };
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser();
        setUser(normalizeUser(userData));
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
  };

  const clearUser = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    setUser,
    refreshUser,
    clearUser,
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
