"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartLineItem } from "@/types/product";

type CartContextValue = {
  items: CartLineItem[];
  subtotal: number;
  total: number;
  itemCount: number;
  addItem: (item: CartLineItem) => void;
  updateQuantity: (productId: string, size: string, color: string, change: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "adis-fashion-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  useEffect(() => {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart) as CartLineItem[]);
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartLineItem) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (entry) =>
          entry.productId === item.productId &&
          entry.size === item.size &&
          entry.color === item.color,
      );

      if (existingIndex >= 0) {
        const updatedItems = [...currentItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + item.quantity,
        };

        return updatedItems;
      }

      return [...currentItems, item];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, change: number) => {
      setItems((currentItems) =>
        currentItems
          .map((entry) => {
            if (entry.productId === productId && entry.size === size && entry.color === color) {
              return { ...entry, quantity: entry.quantity + change };
            }

            return entry;
          })
          .filter((entry) => entry.quantity > 0),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (entry) => !(entry.productId === productId && entry.size === size && entry.color === color),
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal,
      total: subtotal,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, itemCount, items, removeItem, subtotal, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
