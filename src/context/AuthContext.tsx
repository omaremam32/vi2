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

import type {
  Customer,
  LoginCredentials,
  RegisterCredentials,
} from "@/domain/customer";
import { services } from "@/services";

type AuthContextValue = {
  customer: Customer | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (
    credentials: LoginCredentials,
  ) => Promise<{ ok: true; customer: Customer } | { ok: false; message: string }>;
  register: (
    credentials: RegisterCredentials,
  ) => Promise<{ ok: true; customer: Customer } | { ok: false; message: string }>;
  signOut: () => void;
  refreshCustomer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      if (!services.authService.isAuthenticated()) {
        setCustomer(null);
        return;
      }
      const current = await services.authService.getCurrentCustomer();
      setCustomer(current);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();

    const handleAuthChange = () => {
      refreshCustomer();
    };

    window.addEventListener("vi2-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("vi2-auth-change", handleAuthChange);
    };
  }, [refreshCustomer]);

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      const res = await services.authService.signIn(credentials);
      if (res.ok) {
        setCustomer(res.customer);
      }
      setLoading(false);
      return res;
    },
    [],
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setLoading(true);
      const res = await services.authService.register(credentials);
      if (res.ok) {
        setCustomer(res.customer);
      }
      setLoading(false);
      return res;
    },
    [],
  );

  const signOut = useCallback(() => {
    services.authService.signOut();
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: Boolean(customer),
      loading,
      signIn,
      register,
      signOut,
      refreshCustomer,
    }),
    [customer, loading, signIn, register, signOut, refreshCustomer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
