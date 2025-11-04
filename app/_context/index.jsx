"use client";

import { getUser } from "@/lib/auth/utils";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children, initUser }) {
  const [user, setUser] = useState(initUser);
  const [refreshUserLoading, setRrefreshUserLoading] = useState(false);

  const refreshUser = async () => {
    setRrefreshUserLoading(true);
    const userData = await getUser();
    setUser(userData);
    setRrefreshUserLoading(false);
  };

  const clearUser = () => {
    setUser(null);
  };

  const value = {
    user,
    setUser,
    refreshUser,
    refreshUserLoading,
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
