import { medusa } from "../client";
import type { Product } from "@/types/product";

const PRODUCT_FIELDS =
  "id,handle,title,description,thumbnail,metadata,variants.id,variants.title,variants.calculated_price,variants.inventory_quantity,categories.id,categories.name,categories.handle";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapMedusaProduct(p: any): Product {
  const meta: Record<string, unknown> = p.metadata ?? {};
  const variant = p.variants?.[0];

  // Medusa v2 calculated_price contains region-specific pricing
  const calcPrice = variant?.calculated_price;
  const priceRaw = calcPrice?.calculated_amount ?? null;
  const price = priceRaw !== null ? priceRaw / 100 : 0;

  const compareRaw = calcPrice?.original_amount ?? null;
  const compareAtPrice =
    compareRaw !== null && compareRaw !== priceRaw
      ? compareRaw / 100
      : undefined;

  const categoryName =
    p.categories?.[0]?.name ||
    String(meta.category ?? p.type?.value ?? "");

  return {
    id: p.id ?? "",
    slug: p.handle ?? p.id ?? "",
    variantId: variant?.id,
    brand: String(meta.brand ?? "Vi2"),
    name: p.title ?? "",
    shortName: String(meta.shortName ?? p.title ?? ""),
    category: categoryName,
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

export type GetProductsParams = {
  regionId?: string;
  limit?: number;
  offset?: number;
  category_id?: string[];
  q?: string;
  order?: string;
};

export async function getProducts(
  params: GetProductsParams = {},
): Promise<Product[]> {
  try {
    const query: Record<string, unknown> = {
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
      fields: PRODUCT_FIELDS,
    };

    if (params.regionId) {
      query.region_id = params.regionId;
    }
    if (params.category_id?.length) {
      query.category_id = params.category_id;
    }
    if (params.q) {
      query.q = params.q;
    }
    if (params.order) {
      query.order = params.order;
    }

    const { products } = await medusa.store.product.list(query);
    return (products || []).map(mapMedusaProduct);
  } catch (error) {
    console.error("Failed to retrieve products from Medusa:", error);
    return [];
  }
}

export async function getProductByHandle(
  handle: string,
  regionId?: string,
): Promise<Product | null> {
  try {
    const query: Record<string, unknown> = {
      handle,
      limit: 1,
      fields: PRODUCT_FIELDS,
    };

    if (regionId) {
      query.region_id = regionId;
    }

    const { products } = await medusa.store.product.list(query);
    const product = products?.[0];
    if (!product) return null;

    return mapMedusaProduct(product);
  } catch (error) {
    console.error(`Failed to retrieve product by handle "${handle}":`, error);
    return null;
  }
}

export async function getProduct(
  id: string,
  regionId?: string,
): Promise<Product | null> {
  try {
    const query: Record<string, unknown> = {
      fields: PRODUCT_FIELDS,
    };

    if (regionId) {
      query.region_id = regionId;
    }

    const { product } = await medusa.store.product.retrieve(id, query);
    if (!product) return null;

    return mapMedusaProduct(product);
  } catch (error) {
    console.error(`Failed to retrieve product by id "${id}":`, error);
    return null;
  }
}
