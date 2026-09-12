import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const stored = localStorage.getItem("tastybites_user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" && parsed._id && parsed.email ? parsed : null;
  } catch (_) {
    localStorage.removeItem("tastybites_user");
    localStorage.removeItem("tastybites_token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  const persist = (data) => {
    localStorage.setItem("tastybites_token", data.token);
    const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
    localStorage.setItem("tastybites_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return persist(data);
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/admin/login", { email, password });
    return persist(data);
  }, []);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    const { data } = await api.post("/auth/register", { name, email, password, confirmPassword });
    return persist(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tastybites_token");
    localStorage.removeItem("tastybites_user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "Admin";
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
