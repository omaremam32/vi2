"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  PackageCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import styles from "./Success.module.css";

function OrderSuccessContent() {
  const searchParams =
    useSearchParams();

  const reference =
    searchParams.get("order") ??
    "VI2";

  return (
    <main className={styles.page}>
      <div className={styles.mark}>
        <Check
          size={34}
          strokeWidth={1.4}
        />
      </div>

      <span className={styles.eyebrow}>
        ORDER CONFIRMED
      </span>

      <h1>
        THANK
        <br />
        YOU.
      </h1>

      <p>
        Your order has been received.
        Keep the reference below for your records.
      </p>

      <div className={styles.reference}>
        <span>
          ORDER REFERENCE
        </span>

        <strong>
          {reference}
        </strong>
      </div>

      <div className={styles.status}>
        <PackageCheck
          size={22}
          strokeWidth={1.5}
        />

        <div>
          <strong>
            ORDER RECEIVED
          </strong>

          <span>
            Your order is ready for the next fulfillment step.
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link
          href="/shop"
          className={
            styles.primary
          }
        >
          CONTINUE SHOPPING

          <ArrowRight
            size={16}
            strokeWidth={1.6}
          />
        </Link>

        <Link
          href="/"
          className={
            styles.secondary
          }
        >
          BACK HOME
        </Link>
      </div>
    </main>
  );
}

function SuccessFallback() {
  return (
    <main className={styles.page}>
      <div className={styles.mark}>
        <Check
          size={34}
          strokeWidth={1.4}
        />
      </div>

      <span className={styles.eyebrow}>
        ORDER CONFIRMED
      </span>

      <h1>
        THANK
        <br />
        YOU.
      </h1>

      <p>
        Loading your order confirmation...
      </p>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <SuccessFallback />
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
