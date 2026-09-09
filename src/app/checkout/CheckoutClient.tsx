"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Landmark,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck,
  WalletCards,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  FormEvent,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/data/products";
import type { Product } from "@/types/product";

import styles from "./Checkout.module.css";

type CheckoutItem = {
  product: Product;
  quantity: number;
};

type PaymentMethod =
  | "cod"
  | "card"
  | "instapay"
  | "vodafone"
  | "etisalat";

const governorates = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Sharqia",
  "Dakahlia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "Suez",
  "Ismailia",
  "Port Said",
];

function formatPrice(value: number) {
  return new Intl.NumberFormat(
    "en-EG",
  ).format(value);
}

function normalizeEgyptPhone(
  value: string,
) {
  return value.replace(
    /[\s\-()]/g,
    "",
  );
}

function isValidEgyptPhone(
  value: string,
) {
  const phone =
    normalizeEgyptPhone(value);

  return (
    /^01[0125]\d{8}$/.test(phone) ||
    /^\+201[0125]\d{8}$/.test(phone) ||
    /^00201[0125]\d{8}$/.test(phone)
  );
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const formRef =
    useRef<HTMLFormElement>(null);

  const {
    items,
    clearCart,
  } = useCart();

  const buyNowSlug =
    searchParams.get("buyNow");

  const requestedQuantity =
    Number(
      searchParams.get("quantity") ??
        "1",
    );

  const buyNowProduct =
    buyNowSlug
      ? getProductBySlug(buyNowSlug)
      : undefined;

  const buyNowQuantity =
    Number.isFinite(
      requestedQuantity,
    )
      ? Math.max(
          1,
          Math.min(
            requestedQuantity,
            buyNowProduct?.stock ??
              1,
          ),
        )
      : 1;

  const checkoutItems =
    useMemo<CheckoutItem[]>(() => {
      if (buyNowProduct) {
        return [
          {
            product:
              buyNowProduct,
            quantity:
              buyNowQuantity,
          },
        ];
      }

      return items;
    }, [
      buyNowProduct,
      buyNowQuantity,
      items,
    ]);

  const subtotal = useMemo(
    () =>
      checkoutItems.reduce(
        (sum, item) =>
          sum +
          item.product.price *
            item.quantity,
        0,
      ),
    [checkoutItems],
  );

  const delivery =
    subtotal >= 2500 ||
    subtotal === 0
      ? 0
      : 85;

  const total =
    subtotal + delivery;

  const amountUntilFreeDelivery =
    Math.max(
      0,
      2500 - subtotal,
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "cod",
    );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    phoneError,
    setPhoneError,
  ] = useState("");

  const [
    summaryOpen,
    setSummaryOpen,
  ] = useState(false);

  const [
    phoneValue,
    setPhoneValue,
  ] = useState("");

  const [
    codPhoneReady,
    setCodPhoneReady,
  ] = useState(false);

  const [
    governorateValue,
    setGovernorateValue,
  ] = useState("");

  const [
    areaValue,
    setAreaValue,
  ] = useState("");

  const [
    addressValue,
    setAddressValue,
  ] = useState("");

  const [
    addressStatus,
    setAddressStatus,
  ] = useState<
    "idle" | "ready" | "error"
  >("idle");

  const [
    savedAddressAvailable,
    setSavedAddressAvailable,
  ] = useState(false);

  const [
    saveAddress,
    setSaveAddress,
  ] = useState(true);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          "vi2-saved-address",
        );

      setSavedAddressAvailable(
        Boolean(raw),
      );
    } catch {
      setSavedAddressAvailable(
        false,
      );
    }
  }, []);

  function fillSavedAddress() {
    try {
      const raw =
        window.localStorage.getItem(
          "vi2-saved-address",
        );

      if (!raw) {
        return;
      }

      const saved =
        JSON.parse(raw) as {
          governorate?: string;
          area?: string;
          address?: string;
        };

      setGovernorateValue(
        saved.governorate ?? "",
      );

      setAreaValue(
        saved.area ?? "",
      );

      setAddressValue(
        saved.address ?? "",
      );

      setAddressStatus(
        "ready",
      );
    } catch {
      setAddressStatus(
        "error",
      );
    }
  }

  function checkAddressDetails() {
    const ready =
      governorateValue.trim().length >
        0 &&
      areaValue.trim().length >= 2 &&
      addressValue.trim().length >= 8;

    setAddressStatus(
      ready
        ? "ready"
        : "error",
    );
  }

  function checkCodPhone() {
    setPhoneError("");

    if (
      !isValidEgyptPhone(
        phoneValue,
      )
    ) {
      setCodPhoneReady(false);

      setPhoneError(
        "Enter a valid Egyptian mobile number first.",
      );

      return;
    }

    setCodPhoneReady(true);
  }

  function submitFromMobileBar() {
    formRef.current?.requestSubmit();
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setPhoneError("");

    if (
      checkoutItems.length === 0
    ) {
      setError(
        "Your order is empty. Add a product before placing the order.",
      );

      return;
    }

    const formData =
      new FormData(
        event.currentTarget,
      );

    const name = String(
      formData.get("name") ??
        "",
    ).trim();

    const phone = String(
      formData.get("phone") ??
        "",
    ).trim();

    const governorate =
      String(
        formData.get(
          "governorate",
        ) ?? "",
      ).trim();

    const area = String(
      formData.get("area") ??
        "",
    ).trim();

    const address = String(
      formData.get("address") ??
        "",
    ).trim();

    if (
      !name ||
      !phone ||
      !governorate ||
      !area ||
      !address
    ) {
      setError(
        "Please complete all required fields.",
      );

      return;
    }

    if (
      !isValidEgyptPhone(
        phone,
      )
    ) {
      setPhoneError(
        "Enter a valid Egyptian mobile number, for example 01012345678.",
      );

      return;
    }

    setSubmitting(true);

    const reference =
      `VI2${Date.now()
        .toString()
        .slice(-7)}`;

    const order = {
      reference,
      createdAt:
        new Date().toISOString(),
      customer: {
        name,
        phone:
          normalizeEgyptPhone(
            phone,
          ),
        email: String(
          formData.get(
            "email",
          ) ?? "",
        ).trim(),
        governorate,
        area,
        address,
        notes: String(
          formData.get(
            "notes",
          ) ?? "",
        ).trim(),
      },
      paymentMethod,
      subtotal,
      delivery,
      total,
      items:
        checkoutItems.map(
          (item) => ({
            id:
              item.product.id,
            slug:
              item.product.slug,
            name:
              item.product.name,
            price:
              item.product.price,
            quantity:
              item.quantity,
          }),
        ),
    };

    window.localStorage.setItem(
      "vi2-last-order",
      JSON.stringify(order),
    );

    if (saveAddress) {
      try {
        window.localStorage.setItem(
          "vi2-saved-address",
          JSON.stringify({
            governorate,
            area,
            address,
          }),
        );

        setSavedAddressAvailable(
          true,
        );
      } catch {
        // Checkout should not fail if local storage is unavailable.
      }
    }

    if (!buyNowProduct) {
      clearCart();
    }

    router.push(
      `/order/success?order=${reference}`,
    );
  }

  return (
    <>
      <main className={styles.page}>
        <header
          className={
            styles.checkoutHeader
          }
        >
          <Link
            href={
              buyNowProduct
                ? `/products/${buyNowProduct.slug}`
                : "/shop"
            }
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.6}
            />

            BACK
          </Link>

          <div>
            <ShieldCheck
              size={15}
              strokeWidth={1.4}
            />

            <span>
              SECURE CHECKOUT
            </span>

            <strong>
              VI2
            </strong>
          </div>
        </header>

        <div
          className={
            styles.mobileSummaryBar
          }
        >
          <button
            type="button"
            onClick={() =>
              setSummaryOpen(
                (current) =>
                  !current,
              )
            }
          >
            <div>
              <span>
                YOUR ORDER
              </span>

              <strong>
                {checkoutItems.reduce(
                  (
                    count,
                    item,
                  ) =>
                    count +
                    item.quantity,
                  0,
                )}{" "}
                ITEM
                {checkoutItems.reduce(
                  (
                    count,
                    item,
                  ) =>
                    count +
                    item.quantity,
                  0,
                ) === 1
                  ? ""
                  : "S"}
              </strong>
            </div>

            <div>
              <strong>
                {formatPrice(
                  total,
                )}{" "}
                EGP
              </strong>

              <ChevronDown
                size={17}
                className={
                  summaryOpen
                    ? styles.summaryChevronOpen
                    : ""
                }
              />
            </div>
          </button>

          {summaryOpen && (
            <div
              className={
                styles.mobileSummaryDrop
              }
            >
              {checkoutItems.map(
                (item) => (
                  <div
                    key={
                      item.product.id
                    }
                    className={
                      styles.mobileSummaryItem
                    }
                  >
                    <img
                      src={
                        item.product
                          .image
                      }
                      alt={
                        item.product
                          .name
                      }
                    />

                    <div>
                      <span>
                        {
                          item.product
                            .brand
                        }
                      </span>

                      <strong>
                        {
                          item.product
                            .shortName
                        }
                      </strong>

                      <small>
                        {item.quantity}
                        ×{" "}
                        {formatPrice(
                          item
                            .product
                            .price,
                        )}{" "}
                        EGP
                      </small>
                    </div>
                  </div>
                ),
              )}

              <div
                className={
                  styles.mobileSummaryTotals
                }
              >
                <div>
                  <span>
                    Delivery
                  </span>

                  <strong>
                    {delivery ===
                    0
                      ? "FREE"
                      : `${formatPrice(
                          delivery,
                        )} EGP`}
                  </strong>
                </div>

                <div>
                  <span>
                    Total
                  </span>

                  <strong>
                    {formatPrice(
                      total,
                    )}{" "}
                    EGP
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          ref={formRef}
          className={
            styles.layout
          }
          onSubmit={
            handleSubmit
          }
        >
          <div
            className={
              styles.formColumn
            }
          >
            <section
              className={
                styles.checkoutIntro
              }
            >
              <div>
                <span>
                  CHECKOUT
                </span>

                <h1>
                  FAST.
                  <br />
                  SIMPLE.
                </h1>
              </div>

              <p>
                Enter the essentials,
                choose how you want to
                pay, and you&apos;re done.
              </p>
            </section>

            <section
              className={
                styles.section
              }
            >
              <div
                className={
                  styles.sectionNumber
                }
              >
                01
              </div>

              <div
                className={
                  styles.sectionBody
                }
              >
                <div
                  className={
                    styles.sectionHeading
                  }
                >
                  <h2>
                    CONTACT
                  </h2>

                  <span>
                    WHO ARE WE
                    DELIVERING TO?
                  </span>
                </div>

                <div
                  className={
                    styles.fields
                  }
                >
                  <label
                    className={
                      styles.fullField
                    }
                  >
                    <span>
                      FULL NAME *
                    </span>

                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                    />
                  </label>

                  <label>
                    <span>
                      PHONE *
                    </span>

                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="01012345678"
                      value={phoneValue}
                      onChange={(event) => {
                        setPhoneValue(
                          event.target.value,
                        );

                        setPhoneError("");
                        setCodPhoneReady(
                          false,
                        );
                      }}
                    />

                    {phoneError && (
                      <small
                        className={
                          styles.fieldError
                        }
                      >
                        {phoneError}
                      </small>
                    )}
                  </label>

                  <label>
                    <span>
                      EMAIL
                    </span>

                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section
              className={
                styles.section
              }
            >
              <div
                className={
                  styles.sectionNumber
                }
              >
                02
              </div>

              <div
                className={
                  styles.sectionBody
                }
              >
                <div
                  className={
                    styles.sectionHeading
                  }
                >
                  <h2>
                    DELIVERY
                  </h2>

                  <span>
                    WHERE SHOULD
                    IT GO?
                  </span>
                </div>

                <div
                  className={
                    styles.fields
                  }
                >
                  <label>
                    <span>
                      GOVERNORATE *
                    </span>

                    <select
                      name="governorate"
                      value={governorateValue}
                      onChange={(event) => {
                        setGovernorateValue(
                          event.target.value,
                        );

                        setAddressStatus(
                          "idle",
                        );
                      }}
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select
                      </option>

                      {governorates.map(
                        (
                          governorate,
                        ) => (
                          <option
                            key={
                              governorate
                            }
                            value={
                              governorate
                            }
                          >
                            {
                              governorate
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label>
                    <span>
                      AREA *
                    </span>

                    <input
                      name="area"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Area / district"
                      value={areaValue}
                      onChange={(event) => {
                        setAreaValue(
                          event.target.value,
                        );

                        setAddressStatus(
                          "idle",
                        );
                      }}
                    />
                  </label>

                  <label
                    className={
                      styles.fullField
                    }
                  >
                    <span>
                      ADDRESS *
                    </span>

                    <input
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      placeholder="Building, street, floor and apartment"
                      value={addressValue}
                      onChange={(event) => {
                        setAddressValue(
                          event.target.value,
                        );

                        setAddressStatus(
                          "idle",
                        );
                      }}
                    />
                  </label>

                  <label
                    className={
                      styles.fullField
                    }
                  >
                    <span>
                      DELIVERY NOTES
                    </span>

                    <input
                      name="notes"
                      type="text"
                      placeholder="Optional instructions"
                    />
                  </label>
                </div>

                <div
                  className={
                    styles.addressTools
                  }
                >
                  <div
                    className={
                      styles.addressActions
                    }
                  >
                    <button
                      type="button"
                      disabled={
                        !savedAddressAvailable
                      }
                      onClick={
                        fillSavedAddress
                      }
                    >
                      USE SAVED ADDRESS
                    </button>

                    <button
                      type="button"
                      onClick={
                        checkAddressDetails
                      }
                    >
                      CHECK ADDRESS
                    </button>
                  </div>

                  <label
                    className={
                      styles.saveAddress
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        saveAddress
                      }
                      onChange={(event) =>
                        setSaveAddress(
                          event.target
                            .checked,
                        )
                      }
                    />

                    <span>
                      SAVE THIS ADDRESS ON
                      THIS DEVICE
                    </span>
                  </label>

                  {addressStatus !==
                    "idle" && (
                    <div
                      className={
                        addressStatus ===
                        "ready"
                          ? styles.addressReady
                          : styles.addressError
                      }
                    >
                      {addressStatus ===
                      "ready"
                        ? "ADDRESS DETAILS READY"
                        : "COMPLETE GOVERNORATE, AREA AND FULL ADDRESS"}
                    </div>
                  )}

                  <div
                    className={
                      styles.localMarketNotice
                    }
                  >
                    <ShieldCheck
                      size={14}
                      strokeWidth={1.4}
                    />

                    <span>
                      All customer prices are
                      shown in EGP. Vi2 handles
                      supplier/import costs before
                      checkout, so there are no
                      surprise international duties
                      added to this order.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section
              className={
                styles.section
              }
            >
              <div
                className={
                  styles.sectionNumber
                }
              >
                03
              </div>

              <div
                className={
                  styles.sectionBody
                }
              >
                <div
                  className={
                    styles.sectionHeading
                  }
                >
                  <h2>
                    PAYMENT
                  </h2>

                  <span>
                    CHOOSE ONE
                  </span>
                </div>

                <div
                  className={
                    styles.paymentOptions
                  }
                >
                  <label
                    className={
                      paymentMethod ===
                      "cod"
                        ? styles.paymentSelected
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={
                        paymentMethod ===
                        "cod"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "cod",
                        )
                      }
                    />

                    <WalletCards
                      size={19}
                      strokeWidth={1.45}
                    />

                    <div>
                      <strong>
                        CASH
                      </strong>

                      <span>
                        Pay on
                        delivery
                      </span>
                    </div>

                    {paymentMethod ===
                      "cod" && (
                      <Check
                        size={16}
                      />
                    )}
                  </label>

                  <label
                    className={
                      paymentMethod ===
                      "card"
                        ? styles.paymentSelected
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={
                        paymentMethod ===
                        "card"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "card",
                        )
                      }
                    />

                    <CreditCard
                      size={19}
                      strokeWidth={1.45}
                    />

                    <div>
                      <strong>
                        CARD
                      </strong>

                      <span>
                        Visa / Mastercard / Meeza
                      </span>
                    </div>

                    {paymentMethod ===
                      "card" && (
                      <Check
                        size={16}
                      />
                    )}
                  </label>

                  <label
                    className={
                      paymentMethod ===
                      "instapay"
                        ? styles.paymentSelected
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="instapay"
                      checked={
                        paymentMethod ===
                        "instapay"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "instapay",
                        )
                      }
                    />

                    <Landmark
                      size={19}
                      strokeWidth={1.45}
                    />

                    <div>
                      <strong>
                        INSTAPAY
                      </strong>

                      <span>
                        Bank
                        transfer
                      </span>
                    </div>

                    {paymentMethod ===
                      "instapay" && (
                      <Check
                        size={16}
                      />
                    )}
                  </label>

                  <label
                    className={
                      paymentMethod ===
                      "vodafone"
                        ? styles.paymentSelected
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="vodafone"
                      checked={
                        paymentMethod ===
                        "vodafone"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "vodafone",
                        )
                      }
                    />

                    <Smartphone
                      size={19}
                      strokeWidth={1.45}
                    />

                    <div>
                      <strong>
                        MOBILE WALLET
                      </strong>

                      <span>
                        Vodafone Cash
                      </span>
                    </div>

                    {paymentMethod ===
                      "vodafone" && (
                      <Check
                        size={16}
                      />
                    )}
                  </label>

                  <label
                    className={
                      paymentMethod ===
                      "etisalat"
                        ? styles.paymentSelected
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="etisalat"
                      checked={
                        paymentMethod ===
                        "etisalat"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "etisalat",
                        )
                      }
                    />

                    <Smartphone
                      size={19}
                      strokeWidth={1.45}
                    />

                    <div>
                      <strong>
                        MOBILE WALLET
                      </strong>

                      <span>
                        Etisalat Cash
                      </span>
                    </div>

                    {paymentMethod ===
                      "etisalat" && (
                      <Check
                        size={16}
                      />
                    )}
                  </label>
                </div>

                {paymentMethod === "cod" && (
                  <div className={styles.codNotice}>
                    <ShieldCheck
                      size={15}
                      strokeWidth={1.45}
                    />

                    <div>
                      <strong>
                        COD MOBILE VERIFICATION
                      </strong>

                      <span>
                        SMS / WhatsApp OTP can use
                        the mobile number entered
                        above before final COD
                        confirmation.
                      </span>

                      <button
                        type="button"
                        onClick={
                          checkCodPhone
                        }
                      >
                        {codPhoneReady
                          ? "NUMBER READY"
                          : "CHECK MOBILE NUMBER"}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p
                    className={
                      styles.error
                    }
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    styles.placeOrderButton
                  }
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "PLACING ORDER..."
                    : `PLACE ORDER · ${formatPrice(
                        total,
                      )} EGP`}
                </button>

                <div
                  className={
                    styles.secureNote
                  }
                >
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.5}
                  />

                  <span>
                    No account
                    required.
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside
            className={
              styles.summary
            }
          >
            <div
              className={
                styles.summaryInner
              }
            >
              <span
                className={
                  styles.summaryEyebrow
                }
              >
                YOUR ORDER
              </span>

              <h2>
                ORDER
                <br />
                SUMMARY
              </h2>

              <div
                className={
                  styles.orderItems
                }
              >
                {checkoutItems.length ===
                0 ? (
                  <div
                    className={
                      styles.emptyOrder
                    }
                  >
                    <PackageCheck
                      size={27}
                      strokeWidth={1.3}
                    />

                    <p>
                      No products in
                      your order.
                    </p>

                    <Link href="/shop">
                      RETURN TO SHOP
                    </Link>
                  </div>
                ) : (
                  checkoutItems.map(
                    (item) => (
                      <article
                        key={
                          item
                            .product
                            .id
                        }
                        className={
                          styles.orderItem
                        }
                      >
                        <div
                          className={
                            styles.orderImage
                          }
                        >
                          <img
                            src={
                              item
                                .product
                                .image
                            }
                            alt={
                              item
                                .product
                                .name
                            }
                          />

                          <span>
                            {
                              item.quantity
                            }
                          </span>
                        </div>

                        <div
                          className={
                            styles.orderItemInfo
                          }
                        >
                          <span>
                            {
                              item
                                .product
                                .brand
                            }
                          </span>

                          <strong>
                            {
                              item
                                .product
                                .shortName
                            }
                          </strong>

                          <small>
                            {
                              item
                                .product
                                .size
                            }
                          </small>
                        </div>

                        <strong
                          className={
                            styles.orderItemPrice
                          }
                        >
                          {formatPrice(
                            item
                              .product
                              .price *
                              item.quantity,
                          )}{" "}
                          EGP
                        </strong>
                      </article>
                    ),
                  )
                )}
              </div>

              <div
                className={
                  styles.totals
                }
              >
                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    {formatPrice(
                      subtotal,
                    )}{" "}
                    EGP
                  </strong>
                </div>

                <div>
                  <span>
                    Delivery
                  </span>

                  <strong>
                    {delivery ===
                    0
                      ? "FREE"
                      : `${formatPrice(
                          delivery,
                        )} EGP`}
                  </strong>
                </div>

                {subtotal >
                  0 &&
                  subtotal <
                    2500 && (
                    <div
                      className={
                        styles.freeDeliveryProgress
                      }
                    >
                      <div>
                        <span>
                          {
                            formatPrice(
                              amountUntilFreeDelivery,
                            )
                          }{" "}
                          EGP TO FREE
                          DELIVERY
                        </span>
                      </div>

                      <div
                        className={
                          styles.progressTrack
                        }
                      >
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              (subtotal /
                                2500) *
                                100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                <div
                  className={
                    styles.grandTotal
                  }
                >
                  <span>
                    TOTAL
                  </span>

                  <strong>
                    {formatPrice(
                      total,
                    )}{" "}
                    EGP
                  </strong>
                </div>
              </div>

              <div
                className={
                  styles.deliveryNote
                }
              >
                <Truck
                  size={18}
                  strokeWidth={1.4}
                />

                <span>
                  Greater Cairo: estimated 1–3 business
                  days. Governorates: estimated 2–5
                  business days.
                </span>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <div
        className={
          styles.mobilePlaceOrder
        }
      >
        <div>
          <span>
            TOTAL
          </span>

          <strong>
            {formatPrice(
              total,
            )}{" "}
            EGP
          </strong>
        </div>

        <button
          type="button"
          disabled={
            submitting ||
            checkoutItems.length ===
              0
          }
          onClick={
            submitFromMobileBar
          }
        >
          {submitting
            ? "PLACING..."
            : "PLACE ORDER"}
        </button>
      </div>
    </>
  );
}
