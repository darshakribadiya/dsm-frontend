"use client";

import { getUser } from "@/lib/auth/utils";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { data: session } = useSession();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
    session && fetchUser();
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
    setUser,
    refreshUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
