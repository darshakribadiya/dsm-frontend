"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    const fetchCurrentUser = useCallback(async () => {
        const token = Cookies.get("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const res = await api.get("/me");
            setUser(res.data?.user ?? res.data ?? null);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const login = useCallback(async (credentials) => {
        const res = await api.post("/login", credentials);
        const { token, user: loggedInUser } = res.data || {};
        if (token) {
            Cookies.set("token", token);
        }
        setUser(loggedInUser ?? null);
        return res.data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/logout").catch(() => { });
        } finally {
            Cookies.remove("token");
            setUser(null);
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
    }, []);

    const value = useMemo(
        () => ({ user, setUser, isAuthenticated, loading, login, logout }),
        [user, isAuthenticated, loading, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
