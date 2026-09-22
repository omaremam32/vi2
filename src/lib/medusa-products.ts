import type { Product } from "@/types/product";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const REGION_ID =
  process.env.MEDUSA_REGION_ID || "reg_01M329WR0PPZ3Z6FXFE87D9ABJ";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
};

// Use calculated_price (requires region_id) — gives the final EGP price
const FIELDS =
  "id,handle,title,description,thumbnail,metadata,variants.id,variants.title,variants.calculated_price,variants.inventory_quantity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMedusaProduct(p: any): Product {
  const meta: Record<string, unknown> = p.metadata ?? {};
  const variant = p.variants?.[0];

  // calculated_price is the region-specific final price
  const calcPrice = variant?.calculated_price;
  const priceRaw = calcPrice?.calculated_amount ?? null;
  const price = priceRaw !== null ? priceRaw / 100 : 0;

  const compareRaw = calcPrice?.original_amount ?? null;
  const compareAtPrice =
    compareRaw !== null && compareRaw !== priceRaw
      ? compareRaw / 100
      : undefined;

  return {
    id: p.id ?? "",
    slug: p.handle ?? p.id ?? "",
    variantId: variant?.id,
    brand: String(meta.brand ?? "Vi2"),
    name: p.title ?? "",
    shortName: String(meta.shortName ?? p.title ?? ""),
    category: String(meta.category ?? p.type?.value ?? ""),
    description: p.description ?? "",
    price,
    ...(compareAtPrice !== undefined ? { compareAtPrice } : {}),
    rating: Number(meta.rating ?? 0),
    reviewCount: Number(meta.reviewCount ?? 0),
    image: p.thumbnail ?? String(meta.image ?? ""),
    ...(meta.flavor ? { flavor: String(meta.flavor) } : {}),
    ...(meta.size ? { size: String(meta.size) } : {}),
    ...(meta.servings ? { servings: Number(meta.servings) } : {}),
    stock: Number(meta.stock ?? variant?.inventory_quantity ?? 99),
    ...(meta.badge ? { badge: String(meta.badge) } : {}),
  };
}

export async function getMedusaProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/products?limit=100&region_id=${REGION_ID}&fields=${FIELDS}`,
      { headers, next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error("Medusa products fetch failed:", res.status, await res.text());
      return [];
    }
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.products ?? []).map((p: any) => mapMedusaProduct(p));
  } catch (err) {
    console.error("getMedusaProducts error:", err);
    return [];
  }
}

export async function getMedusaProductByHandle(
  handle: string
): Promise<Product | undefined> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/products?handle=${encodeURIComponent(handle)}&region_id=${REGION_ID}&fields=${FIELDS}`,
      { headers, next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error("Medusa product handle fetch failed:", res.status);
      return undefined;
    }
    const data = await res.json();
    const product = data.products?.[0];
    if (!product) return undefined;
    return mapMedusaProduct(product);
  } catch (err) {
    console.error("getMedusaProductByHandle error:", err);
    return undefined;
  }
}
