import { Suspense } from "react";

import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutClient />
    </Suspense>
  );
}

function CheckoutLoading() {
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
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.14em",
        }}
      >
        PREPARING CHECKOUT
      </span>
    </main>
  );
}
