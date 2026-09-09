"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronDown,
  FileCheck2,
  FlaskConical,
  Minus,
  PackageCheck,
  Plus,
  Repeat2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useCart } from "@/context/CartContext";
import ProductSocialProof from "@/components/ProductSocialProof";
import ProductValueOffer from "@/components/ProductValueOffer";
import RegulatoryDisclosure from "@/components/RegulatoryDisclosure";
import type { Product } from "@/types/product";
import {
  getProductForm,
  getProductHealthGoals,
} from "@/lib/catalogMeta";

import styles from "./ProductDetail.module.css";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-EG").format(value);
}

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [factsOpen, setFactsOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const [purchaseMode, setPurchaseMode] =
    useState<"once" | "repeat">("once");

  const [repeatEvery, setRepeatEvery] =
    useState("2 months");

  const maxQuantity = Math.max(1, Math.min(product.stock, 10));

  const total = useMemo(
    () => product.price * quantity,
    [product.price, quantity],
  );

  const healthGoalLabels =
    getProductHealthGoals(product);

  const productForm =
    getProductForm(product);

  const repeatPrice =
    Math.round(
      product.price * 0.95,
    );

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(maxQuantity, current + 1),
    );
  }

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1400);
  }

  function handleBuyNow() {
    router.push(
      `/checkout?buyNow=${encodeURIComponent(
        product.slug,
      )}&quantity=${quantity}`,
    );
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.topBar}>
          <Link href="/shop" className={styles.backLink}>
            <ArrowLeft size={15} strokeWidth={1.6} />
            BACK TO SHOP
          </Link>

          <span>{product.category.toUpperCase()}</span>
        </div>

        <section className={styles.productLayout}>
          <div className={styles.visualPanel}>
            {product.badge && (
              <span className={styles.badge}>
                {product.badge}
              </span>
            )}

            <div className={styles.visualGlow} />

            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />

            <span className={styles.visualIndex}>01</span>
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.infoInner}>
              <span className={styles.brand}>
                {product.brand}
              </span>

              <h1>{product.shortName}</h1>

              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      strokeWidth={1.4}
                      fill={
                        index < Math.round(product.rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <strong>{product.rating}</strong>

                <span>
                  {new Intl.NumberFormat("en-EG").format(
                    product.reviewCount,
                  )}{" "}
                  reviews
                </span>
              </div>

              <div className={styles.qualityChips}>
                <span>
                  <ShieldCheck
                    size={13}
                    strokeWidth={1.5}
                  />
                  AUTHENTICITY FOCUSED
                </span>

                <span>
                  <FlaskConical
                    size={13}
                    strokeWidth={1.5}
                  />
                  LAB DOCUMENT AREA
                </span>

                <span>
                  <BadgeCheck
                    size={13}
                    strokeWidth={1.5}
                  />
                  BATCH INFO
                </span>
              </div>

              <div className={styles.priceBlock}>
                <strong>
                  {formatPrice(product.price)} EGP
                </strong>

                {product.compareAtPrice && (
                  <span>
                    {formatPrice(product.compareAtPrice)} EGP
                  </span>
                )}
              </div>

              <p className={styles.description}>
                {product.description}
              </p>

              <div className={styles.productFacts}>
                {product.size && (
                  <div>
                    <span>SIZE</span>
                    <strong>{product.size}</strong>
                  </div>
                )}

                {product.servings && (
                  <div>
                    <span>SERVINGS</span>
                    <strong>{product.servings}</strong>
                  </div>
                )}

                <div>
                  <span>AVAILABILITY</span>
                  <strong
                    className={
                      product.stock > 8
                        ? styles.inStock
                        : styles.lowStock
                    }
                  >
                    {product.stock > 8
                      ? "IN STOCK"
                      : "LOW STOCK"}
                  </strong>
                </div>
              </div>

              {product.flavor && (
                <div className={styles.optionBlock}>
                  <span className={styles.optionLabel}>
                    FLAVOR
                  </span>

                  <button
                    type="button"
                    className={styles.selectedOption}
                  >
                    {product.flavor}
                  </button>
                </div>
              )}

              <div className={styles.repeatDelivery}>
                <div className={styles.repeatHeader}>
                  <div>
                    <Repeat2
                      size={17}
                      strokeWidth={1.5}
                    />

                    <div>
                      <strong>
                        AUTO-SHIP & SAVE
                      </strong>

                      <span>
                        Choose a repeat-delivery preference.
                      </span>
                    </div>
                  </div>

                  <span className={styles.repeatBadge}>
                    SAVE 5%
                  </span>
                </div>

                <div className={styles.purchaseModeGrid}>
                  <button
                    type="button"
                    className={
                      purchaseMode === "once"
                        ? styles.purchaseModeActive
                        : ""
                    }
                    onClick={() =>
                      setPurchaseMode("once")
                    }
                  >
                    <strong>ONE-TIME</strong>
                    <span>Buy this order once</span>
                  </button>

                  <button
                    type="button"
                    className={
                      purchaseMode === "repeat"
                        ? styles.purchaseModeActive
                        : ""
                    }
                    onClick={() =>
                      setPurchaseMode("repeat")
                    }
                  >
                    <strong>REPEAT DELIVERY</strong>
                    <span>1–3 month frequency</span>
                  </button>
                </div>

                {purchaseMode === "repeat" && (
                  <>
                    <div className={styles.repeatPricePreview}>
                      <span>
                        RECURRING PRICE PREVIEW
                      </span>

                      <strong>
                        {formatPrice(repeatPrice)} EGP
                      </strong>

                      <small>
                        5% recurring-delivery incentive.
                      </small>
                    </div>

                    <div className={styles.frequencyRow}>
                      {[
                        "1 month",
                        "2 months",
                        "3 months",
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={
                            repeatEvery === item
                              ? styles.frequencyActive
                              : ""
                          }
                          onClick={() =>
                            setRepeatEvery(item)
                          }
                        >
                          EVERY {item.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.verifiedNearCta}>
                <BadgeCheck
                  size={14}
                  strokeWidth={1.5}
                />

                <span>
                  VERIFIED-PURCHASE REVIEW SYSTEM READY
                  FOR CUSTOMER ACCOUNTS
                </span>
              </div>

              <div className={styles.purchaseRow}>
                <div className={styles.quantity}>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={15} strokeWidth={1.6} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={increaseQuantity}
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus size={15} strokeWidth={1.6} />
                  </button>
                </div>

                <div className={styles.quantityPrice}>
                  <span>TOTAL</span>
                  <strong>{formatPrice(total)} EGP</strong>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <Check size={17} strokeWidth={1.8} />
                      ADDED
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} strokeWidth={1.6} />
                      ADD TO CART
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={handleBuyNow}
                >
                  BUY NOW
                </button>
              </div>

              <div className={styles.fastNote}>
                <Truck size={17} strokeWidth={1.5} />
                <span>
                  Free delivery on orders over 2,500 EGP.
                </span>
              </div>

              <div className={styles.accordions}>
                <button
                  type="button"
                  className={styles.accordionButton}
                  onClick={() =>
                    setDetailsOpen((current) => !current)
                  }
                >
                  <span>PRODUCT DETAILS</span>

                  <ChevronDown
                    size={17}
                    className={
                      detailsOpen ? styles.chevronOpen : ""
                    }
                  />
                </button>

                {detailsOpen && (
                  <div className={styles.accordionContent}>
                    <p>{product.description}</p>
                    <ul>
                      {product.size && (
                        <li>Size: {product.size}</li>
                      )}
                      {product.servings && (
                        <li>
                          {product.servings} servings
                        </li>
                      )}
                      <li>
                        Stored and delivered with product
                        integrity in mind.
                      </li>
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  className={styles.accordionButton}
                  onClick={() =>
                    setFactsOpen((current) => !current)
                  }
                >
                  <span>SUPPLEMENT FACTS & FORMAT</span>

                  <ChevronDown
                    size={17}
                    className={
                      factsOpen ? styles.chevronOpen : ""
                    }
                  />
                </button>

                {factsOpen && (
                  <div className={styles.accordionContent}>
                    <div className={styles.transparencyGrid}>
                      <div>
                        <span>FORM</span>
                        <strong>{productForm}</strong>
                      </div>

                      <div>
                        <span>SIZE</span>
                        <strong>
                          {product.size ?? "See package"}
                        </strong>
                      </div>

                      <div>
                        <span>SERVINGS</span>
                        <strong>
                          {product.servings ??
                            "See package"}
                        </strong>
                      </div>

                      <div>
                        <span>HEALTH GOALS</span>
                        <strong>
                          {healthGoalLabels.join(", ")}
                        </strong>
                      </div>
                    </div>

                    <p className={styles.transparencyNote}>
                      Full ingredient and supplement-facts
                      panels can be connected to the final
                      catalog data supplied for each product.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className={styles.accordionButton}
                  onClick={() =>
                    setQualityOpen((current) => !current)
                  }
                >
                  <span>QUALITY, BATCH & COMPLIANCE</span>

                  <ChevronDown
                    size={17}
                    className={
                      qualityOpen ? styles.chevronOpen : ""
                    }
                  />
                </button>

                {qualityOpen && (
                  <div className={styles.accordionContent}>
                    <div className={styles.qualityRows}>
                      <div>
                        <FileCheck2
                          size={16}
                          strokeWidth={1.4}
                        />

                        <div>
                          <strong>
                            CERTIFICATE / COA
                          </strong>

                          <span>
                            Document slot prepared for
                            brand-supplied lab certificates.
                          </span>
                        </div>
                      </div>

                      <div>
                        <BadgeCheck
                          size={16}
                          strokeWidth={1.4}
                        />

                        <div>
                          <strong>
                            BATCH & EXPIRY
                          </strong>

                          <span>
                            Batch number and expiry data can
                            be shown per inventory lot.
                          </span>
                        </div>
                      </div>

                      <div>
                        <ShieldCheck
                          size={16}
                          strokeWidth={1.4}
                        />

                        <div>
                          <strong>
                            EDA / REGULATORY STATUS
                          </strong>

                          <span>
                            Compliance badges and disclaimers
                            are ready to connect to verified
                            product records.
                          </span>
                        </div>
                      </div>
                    </div>

                    <RegulatoryDisclosure
                      product={product}
                    />
                  </div>
                )}

                <button
                  type="button"
                  className={styles.accordionButton}
                  onClick={() =>
                    setDeliveryOpen((current) => !current)
                  }
                >
                  <span>DELIVERY & RETURNS</span>

                  <ChevronDown
                    size={17}
                    className={
                      deliveryOpen ? styles.chevronOpen : ""
                    }
                  />
                </button>

                {deliveryOpen && (
                  <div className={styles.accordionContent}>
                    <p>
                      Delivery pricing is shown before placing
                      the order. Orders above 2,500 EGP receive
                      free delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <ProductValueOffer product={product} />

        <ProductSocialProof product={product} />

        <section className={styles.trustSection}>
          <div>
            <ShieldCheck size={22} strokeWidth={1.4} />
            <strong>AUTHENTIC PRODUCTS</strong>
            <span>Carefully selected products.</span>
          </div>

          <div>
            <PackageCheck size={22} strokeWidth={1.4} />
            <strong>SECURE PACKAGING</strong>
            <span>Prepared carefully for delivery.</span>
          </div>

          <div>
            <Truck size={22} strokeWidth={1.4} />
            <strong>DELIVERY ACROSS EGYPT</strong>
            <span>Simple checkout and delivery.</span>
          </div>
        </section>
      </main>

      <div className={styles.mobileBuyBar}>
        <div>
          <span>{product.shortName}</span>
          <strong>{formatPrice(total)} EGP</strong>
        </div>

        <button type="button" onClick={handleBuyNow}>
          BUY NOW
        </button>
      </div>
    </>
  );
}
