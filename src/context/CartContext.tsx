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

import type { Product } from "@/types/product";
import type { Cart, CartPromotion } from "@/domain/cart";
import { services } from "@/services";

export type CartItem = {
  id?: string;
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  promotions: CartPromotion[];
  cartId: string | null;
  cart: Cart | null;
  isCartOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productIdOrLineId: string) => Promise<void>;
  updateQuantity: (productIdOrLineId: string, quantity: number) => Promise<void>;
  applyPromotion: (code: string) => Promise<{ ok: boolean; message?: string }>;
  removePromotion: (code: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = "vi2-medusa-cart-id";
const LOCAL_BACKUP_KEY = "vi2-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync state from Medusa domain cart
  const syncFromDomainCart = useCallback((domainCart: Cart | null) => {
    if (!domainCart) {
      setCart(null);
      setItems([]);
      return;
    }

    setCart(domainCart);
    setCartId(domainCart.id);

    const uiItems: CartItem[] = domainCart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product || {
        id: item.productId,
        slug: item.slug || item.productId,
        variantId: item.variantId,
        brand: item.brand || "Vi2",
        name: item.name,
        shortName: item.name,
        category: "",
        description: "",
        price: item.price,
        rating: 0,
        reviewCount: 0,
        image: item.image || "",
        stock: 99,
      },
    }));

    setItems(uiItems);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_ID_KEY, domainCart.id);
        localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(uiItems));
      } catch {}
    }
  }, []);

  // Ensure an active cart ID exists in Medusa
  const getOrCreateCart = useCallback(async (): Promise<Cart> => {
    if (cart) return cart;

    let existingId: string | null = null;
    if (typeof window !== "undefined") {
      existingId = localStorage.getItem(CART_ID_KEY);
    }

    if (existingId) {
      const existingCart = await services.cartService.getCart(existingId);
      if (existingCart) {
        syncFromDomainCart(existingCart);
        return existingCart;
      }
    }

    // Create fresh cart in Medusa
    const newCart = await services.cartService.createCart();
    syncFromDomainCart(newCart);
    return newCart;
  }, [cart, syncFromDomainCart]);

  // Initial load
  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      let storedId: string | null = null;
      if (typeof window !== "undefined") {
        storedId = localStorage.getItem(CART_ID_KEY);
      }

      if (storedId) {
        const existing = await services.cartService.getCart(storedId);
        if (existing) {
          syncFromDomainCart(existing);
          setLoading(false);
          return;
        }
      }

      // Check if there was an offline backup to migrate
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const freshCart = await services.cartService.createCart();
              syncFromDomainCart(freshCart);
              // Migrate local items
              for (const item of parsed) {
                const varId = item.product?.variantId;
                if (varId) {
                  await services.cartService.addItem(
                    freshCart.id,
                    varId,
                    item.quantity || 1,
                  );
                }
              }
              const populated = await services.cartService.getCart(freshCart.id);
              syncFromDomainCart(populated);
              setLoading(false);
              return;
            }
          } catch {}
        }
      }

      // Create new clean cart
      const created = await services.cartService.createCart();
      syncFromDomainCart(created);
    } catch {
      // Offline fallback: load local backup
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
          if (raw) setItems(JSON.parse(raw));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, [syncFromDomainCart]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(() => {
    if (cart && cart.itemSubtotal > 0) return cart.itemSubtotal;
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [cart, items]);

  const shippingTotal = useMemo(
    () => (cart ? cart.shippingTotal : subtotal >= 2500 || subtotal === 0 ? 0 : 85),
    [cart, subtotal],
  );

  const discountTotal = useMemo(() => (cart ? cart.discountTotal : 0), [cart]);

  const total = useMemo(() => {
    if (cart && cart.total > 0) return cart.total;
    return Math.max(0, subtotal + shippingTotal - discountTotal);
  }, [cart, subtotal, shippingTotal, discountTotal]);

  const promotions = useMemo(() => (cart ? cart.promotions : []), [cart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      openCart();

      // Optimistic update
      setItems((currentItems) => {
        const existing = currentItems.find(
          (item) => item.product.id === product.id,
        );
        if (existing) {
          return currentItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...currentItems, { product, quantity }];
      });

      try {
        const activeCart = await getOrCreateCart();
        const variantId = product.variantId || product.id;
        const updated = await services.cartService.addItem(
          activeCart.id,
          variantId,
          quantity,
        );
        syncFromDomainCart(updated);
      } catch (err) {
        console.error("Failed to add item to Medusa cart:", err);
      }
    },
    [getOrCreateCart, openCart, syncFromDomainCart],
  );

  const removeItem = useCallback(
    async (productIdOrLineId: string) => {
      // Find item
      const itemToRemove = items.find(
        (item) =>
          item.id === productIdOrLineId ||
          item.product.id === productIdOrLineId ||
          item.product.slug === productIdOrLineId,
      );

      // Optimistic update
      setItems((current) =>
        current.filter(
          (item) =>
            item.id !== productIdOrLineId &&
            item.product.id !== productIdOrLineId &&
            item.product.slug !== productIdOrLineId,
        ),
      );

      if (cart && itemToRemove?.id) {
        try {
          const updated = await services.cartService.removeItem(
            cart.id,
            itemToRemove.id,
          );
          syncFromDomainCart(updated);
        } catch (err) {
          console.error("Failed to remove item from Medusa cart:", err);
        }
      }
    },
    [cart, items, syncFromDomainCart],
  );

  const updateQuantity = useCallback(
    async (productIdOrLineId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productIdOrLineId);
        return;
      }

      const target = items.find(
        (item) =>
          item.id === productIdOrLineId ||
          item.product.id === productIdOrLineId ||
          item.product.slug === productIdOrLineId,
      );

      // Optimistic update
      setItems((current) =>
        current.map((item) => {
          if (
            item.id === productIdOrLineId ||
            item.product.id === productIdOrLineId ||
            item.product.slug === productIdOrLineId
          ) {
            return { ...item, quantity };
          }
          return item;
        }),
      );

      if (cart && target?.id) {
        try {
          const updated = await services.cartService.updateItem(
            cart.id,
            target.id,
            quantity,
          );
          syncFromDomainCart(updated);
        } catch (err) {
          console.error("Failed to update item quantity in Medusa cart:", err);
        }
      }
    },
    [cart, items, removeItem, syncFromDomainCart],
  );

  const applyPromotion = useCallback(
    async (code: string): Promise<{ ok: boolean; message?: string }> => {
      if (!cart) return { ok: false, message: "Cart not initialized" };
      try {
        const updated = await services.cartService.applyPromotion(
          cart.id,
          code.trim(),
        );
        syncFromDomainCart(updated);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Invalid or expired promotion code";
        return { ok: false, message: msg };
      }
    },
    [cart, syncFromDomainCart],
  );

  const removePromotion = useCallback(
    async (code: string): Promise<void> => {
      if (!cart) return;
      try {
        const updated = await services.cartService.removePromotion(
          cart.id,
          code.trim(),
        );
        syncFromDomainCart(updated);
      } catch (err) {
        console.error("Failed to remove promotion code:", err);
      }
    },
    [cart, syncFromDomainCart],
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    setCart(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(CART_ID_KEY);
        localStorage.removeItem(LOCAL_BACKUP_KEY);
      } catch {}
    }
    try {
      const newCart = await services.cartService.createCart();
      syncFromDomainCart(newCart);
    } catch {}
  }, [syncFromDomainCart]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      shippingTotal,
      discountTotal,
      total,
      promotions,
      cartId,
      cart,
      isCartOpen,
      loading,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      applyPromotion,
      removePromotion,
      clearCart,
      refreshCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      shippingTotal,
      discountTotal,
      total,
      promotions,
      cartId,
      cart,
      isCartOpen,
      loading,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      applyPromotion,
      removePromotion,
      clearCart,
      refreshCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}