const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

const TOKEN_KEY = "vi2-medusa-token";

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getMedusaToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setMedusaToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearMedusaToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isMedusaSignedIn(): boolean {
  return Boolean(getMedusaToken());
}

// ─── Auth headers ─────────────────────────────────────────────────────────────

function authHeaders(token?: string | null) {
  const t = token ?? getMedusaToken();
  return {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function medusaRegister(opts: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  try {
    // Step 1: create auth identity and get token
    const authRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: opts.email, password: opts.password }),
    });
    const authData = await authRes.json();
    if (!authRes.ok) {
      return { ok: false, message: authData.message ?? "Registration failed." };
    }
    const token: string = authData.token;

    // Step 2: create customer profile
    const customerRes = await fetch(`${BACKEND_URL}/store/customers`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        first_name: opts.firstName,
        last_name: opts.lastName,
        ...(opts.phone ? { phone: opts.phone } : {}),
      }),
    });
    if (!customerRes.ok) {
      // Auth was created, still return token so user is logged in
      console.warn("Customer profile creation failed — auth still succeeded");
    }

    setMedusaToken(token);
    return { ok: true, token };
  } catch (err) {
    console.error("medusaRegister error:", err);
    return { ok: false, message: "Network error. Please try again." };
  }
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function medusaSignIn(
  email: string,
  password: string
): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        message: data.message ?? "Invalid email or password.",
      };
    }
    setMedusaToken(data.token);
    return { ok: true, token: data.token };
  } catch (err) {
    console.error("medusaSignIn error:", err);
    return { ok: false, message: "Network error. Please try again." };
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export function medusaSignOut() {
  clearMedusaToken();
}

// ─── Get current customer ─────────────────────────────────────────────────────

export type MedusaCustomer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
};

export async function getMedusaCustomer(): Promise<MedusaCustomer | null> {
  const token = getMedusaToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/store/customers/me`, {
      headers: authHeaders(token),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.customer ?? null;
  } catch {
    return null;
  }
}

// ─── Get customer orders ──────────────────────────────────────────────────────

export async function getMedusaOrders() {
  const token = getMedusaToken();
  if (!token) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/store/orders?limit=20`, {
      headers: authHeaders(token),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders ?? [];
  } catch {
    return [];
  }
}
