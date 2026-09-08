"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];

  isCartOpen: boolean;

  itemCount: number;
  subtotal: number;

  openCart: () => void;
  closeCart: () => void;

  addItem: (
    product: Product,
    quantity?: number,
  ) => void;

  removeItem: (productId: string) => void;

  updateQuantity: (
    productId: string,
    quantity: number,
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextValue | null>(null);

const STORAGE_KEY = "vi2-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(
    [],
  );

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (saved) {
        const parsed = JSON.parse(
          saved,
        ) as CartItem[];

        setItems(parsed);
      }
    } catch {
      window.localStorage.removeItem(
        STORAGE_KEY,
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items, loaded]);

  function addItem(
    product: Product,
    quantity = 1,
  ) {
    setItems((currentItems) => {
      const existing =
        currentItems.find(
          (item) =>
            item.product.id === product.id,
        );

      if (existing) {
        return currentItems.map((item) => {
          if (
            item.product.id !== product.id
          ) {
            return item;
          }

          return {
            ...item,
            quantity: Math.min(
              item.quantity + quantity,
              product.stock,
            ),
          };
        });
      }

      return [
        ...currentItems,
        {
          product,
          quantity: Math.min(
            quantity,
            product.stock,
          ),
        },
      ];
    });

    setIsCartOpen(true);
  }

  function removeItem(
    productId: string,
  ) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.product.id !== productId,
      ),
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.product.id !== productId
        ) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            quantity,
            item.product.stock,
          ),
        };
      }),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0,
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        itemCount,
        subtotal,

        openCart: () =>
          setIsCartOpen(true),

        closeCart: () =>
          setIsCartOpen(false),

        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}