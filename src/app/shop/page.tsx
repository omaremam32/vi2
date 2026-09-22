import { Suspense } from "react";

import { getMedusaProducts } from "@/lib/medusa-products";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const products = await getMedusaProducts();

  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopClient products={products} />
    </Suspense>
  );
}

function ShopLoading() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        background: "#fbfaf7",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.14em",
        }}
      >
        LOADING VI2
      </span>
    </main>
  );
}
