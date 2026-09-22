import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || "";
const REGION_ID = process.env.MEDUSA_REGION_ID || "";
const SHIPPING_STANDARD = process.env.MEDUSA_SHIPPING_STANDARD_ID || "";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderItem = {
  id?: string;
  slug?: string;
  name?: string;
  brand?: string;
  image?: string;
  price?: number;
  quantity?: number;
  variantId?: string;
};

type OrderRequest = {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    governorate?: string;
    area?: string;
    address?: string;
    notes?: string;
  };
  paymentMethod?: "cod" | "card" | "instapay";
  subtotal?: number;
  delivery?: number;
  total?: number;
  items?: OrderItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidMoney(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}

function createReference() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `VI2-${y}${m}${day}-${rand}`;
}

// ─── Get Medusa Admin Token ───────────────────────────────────────────────────

async function getAdminToken(): Promise<string> {
  const res = await fetch(`${BACKEND}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error("Admin login failed");
  const data = await res.json();
  return data.token as string;
}

// ─── Create Medusa Draft Order ────────────────────────────────────────────────

async function createMedusaDraftOrder(
  adminToken: string,
  body: OrderRequest,
  reference: string
) {
  const customer = body.customer!;
  const nameParts = (customer.name ?? "").trim().split(" ");
  const firstName = nameParts[0] ?? "Customer";
  const lastName = nameParts.slice(1).join(" ") || "-";

  const address = {
    first_name: firstName,
    last_name: lastName,
    address_1: `${customer.area ?? ""}, ${customer.address ?? ""}`.trim().replace(/^,\s*/, ""),
    city: customer.governorate ?? "Cairo",
    country_code: "eg",
    postal_code: "00000",
    phone: customer.phone ?? "",
  };

  // Map items — use variant_id if available, otherwise custom item
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: any[] = (body.items ?? []).map((item) => {
    const unitPrice = Math.round((item.price ?? 0) * 100); // convert to cents
    if (item.variantId) {
      return {
        variant_id: item.variantId,
        quantity: item.quantity ?? 1,
        unit_price: unitPrice,
      };
    }
    return {
      title: item.name ?? "Product",
      quantity: item.quantity ?? 1,
      unit_price: unitPrice,
      metadata: { slug: item.slug, brand: item.brand },
    };
  });

  const shippingAmount = (body.delivery ?? 0) > 0 ? Math.round((body.delivery ?? 0) * 100) : 0;

  const payload = {
    email: customer.email?.trim() || `guest+${reference.toLowerCase()}@vi2.local`,
    region_id: REGION_ID,
    shipping_address: address,
    billing_address: address,
    shipping_methods: [
      {
        name: shippingAmount === 0 ? "Free Delivery" : "Standard Delivery",
        shipping_option_id: SHIPPING_STANDARD,
        amount: shippingAmount,
      },
    ],
    items,
    metadata: {
      vi2_reference: reference,
      payment_method: body.paymentMethod,
      delivery_notes: customer.notes,
      governorate: customer.governorate,
      area: customer.area,
      phone: customer.phone,
    },
  };

  const res = await fetch(`${BACKEND}/admin/draft-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Draft order creation failed:", JSON.stringify(data));
    throw new Error(data.message ?? "Failed to create order in Medusa");
  }
  return data.draft_order;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;
    const customer = body.customer;

    // Validation
    if (
      !customer?.name?.trim() ||
      !customer.phone?.trim() ||
      !customer.governorate?.trim() ||
      !customer.area?.trim() ||
      !customer.address?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required delivery details." },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Your order is empty." }, { status: 400 });
    }

    if (!body.paymentMethod || !["cod", "card", "instapay"].includes(body.paymentMethod)) {
      return NextResponse.json(
        { error: "Please select a valid payment method." },
        { status: 400 }
      );
    }

    if (!isValidMoney(body.subtotal) || !isValidMoney(body.delivery) || !isValidMoney(body.total)) {
      return NextResponse.json({ error: "The order totals are invalid." }, { status: 400 });
    }

    const reference = createReference();
    const paymentStatus = body.paymentMethod === "cod" ? "unpaid" : "pending";

    // Create real order in Medusa
    let medusaOrderId: string | undefined;
    try {
      const adminToken = await getAdminToken();
      const draftOrder = await createMedusaDraftOrder(adminToken, body, reference);
      medusaOrderId = draftOrder?.id;
    } catch (medusaErr) {
      // Log but don't fail the order — we still confirm to the customer
      console.error("Medusa draft order failed (order still confirmed):", medusaErr);
    }

    return NextResponse.json(
      {
        order: {
          reference,
          medusaOrderId,
          status: "pending",
          paymentStatus,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("VI2 order API error:", error);
    return NextResponse.json(
      { error: "Could not create your order. Please try again." },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ ok: true, service: "vi2-orders" });
}
