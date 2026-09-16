import { NextResponse } from "next/server";

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
  items?: Array<{
    id?: string;
    slug?: string;
    name?: string;
    brand?: string;
    image?: string;
    price?: number;
    quantity?: number;
  }>;
};

function createReference() {
  const date = new Date();
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `VI2-${y}${m}${d}-${random}`;
}

function isValidMoney(value: unknown) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;
    const customer = body.customer;

    if (
      !customer?.name?.trim() ||
      !customer.phone?.trim() ||
      !customer.governorate?.trim() ||
      !customer.area?.trim() ||
      !customer.address?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required delivery details." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your order is empty." },
        { status: 400 },
      );
    }

    if (
      !body.paymentMethod ||
      !["cod", "card", "instapay"].includes(body.paymentMethod)
    ) {
      return NextResponse.json(
        { error: "Please select a valid payment method." },
        { status: 400 },
      );
    }

    if (
      !isValidMoney(body.subtotal) ||
      !isValidMoney(body.delivery) ||
      !isValidMoney(body.total)
    ) {
      return NextResponse.json(
        { error: "The order totals are invalid." },
        { status: 400 },
      );
    }

    for (const item of body.items) {
      if (
        !item.id ||
        !item.slug ||
        !item.name ||
        !isValidMoney(item.price) ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return NextResponse.json(
          { error: "One or more order items are invalid." },
          { status: 400 },
        );
      }
    }

    const paymentStatus =
      body.paymentMethod === "cod" ? "unpaid" : "pending";

    return NextResponse.json(
      {
        order: {
          reference: createReference(),
          status: "pending",
          paymentStatus,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("VI2 order API error:", error);

    return NextResponse.json(
      { error: "Could not create your order. Please try again." },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "vi2-orders",
  });
}
