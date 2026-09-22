import { notFound } from "next/navigation";

import { getMedusaProductByHandle, getMedusaProducts } from "@/lib/medusa-products";
import ProductDetailClient from "./ProductDetailClient";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getMedusaProductByHandle(slug),
    getMedusaProducts(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} allProducts={allProducts} />;
}
