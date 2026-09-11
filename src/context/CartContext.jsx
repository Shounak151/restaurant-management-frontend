import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart().catch(() => {});
  }, [refreshCart]);

  const addItem = async (menuItemId, quantity = 1) => {
    const { data } = await api.post("/cart/items", { menuItemId, quantity });
    setCart(data);
    return data;
  };

  const updateQuantity = async (menuItemId, quantity) => {
    const { data } = await api.patch(`/cart/items/${menuItemId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (menuItemId) => {
    const { data } = await api.delete(`/cart/items/${menuItemId}`);
    setCart(data);
  };

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const total = cart.items.reduce((sum, item) => sum + Number(item.menuItem?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, addItem, updateQuantity, removeItem, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};