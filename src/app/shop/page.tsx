import { Suspense } from "react";

import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopClient />
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
