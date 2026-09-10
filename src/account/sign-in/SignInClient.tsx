"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Gift,
  LockKeyhole,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

import styles from "./SignIn.module.css";

type Notice = {
  type: "info" | "error";
  text: string;
} | null;

export default function SignInClient() {
  const [contact, setContact] =
    useState("");

  const [remember, setRemember] =
    useState(true);

  const [notice, setNotice] =
    useState<Notice>(null);

  function continueWithContact(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!contact.trim()) {
      setNotice({
        type: "error",
        text:
          "Enter your email address or mobile number to continue.",
      });

      return;
    }

    setNotice({
      type: "info",
      text:
        "Secure verification will be enabled when Vi2 account services are connected.",
    });
  }

  function social(
    provider: string,
  ) {
    setNotice({
      type: "info",
      text:
        `${provider} sign-in will be enabled with Vi2 account services.`,
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <Link
          href="/"
          className={styles.back}
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.45}
          />
          BACK
        </Link>

        <Link
          href="/"
          className={styles.logo}
          aria-label="Vi2 home"
        >
          <Image
            src="/brand/vi2-logo-mark-black.png"
            alt="Vi2"
            width={64}
            height={80}
            priority
          />
        </Link>

        <span />
      </div>

      <section className={styles.shell}>
        <header className={styles.heading}>
          <span>VI2 ACCOUNT</span>

          <h1>
            SIGN IN OR CREATE
            <br />
            AN ACCOUNT.
          </h1>

          <p>
            Continue with your email, mobile number
            or preferred account provider.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.formSide}>
            <form
              onSubmit={continueWithContact}
              className={styles.form}
            >
              <label>
                <span>
                  EMAIL OR MOBILE NUMBER
                </span>

                <input
                  value={contact}
                  onChange={(event) => {
                    setContact(
                      event.target.value,
                    );
                    setNotice(null);
                  }}
                  placeholder="Email or mobile number"
                  autoComplete="email"
                />
              </label>

              <button
                type="submit"
                className={styles.continue}
              >
                CONTINUE
              </button>

              <div className={styles.or}>
                <span />
                <strong>OR</strong>
                <span />
              </div>

              <button
                type="button"
                className={styles.provider}
                onClick={() =>
                  social("Google")
                }
              >
                <b className={styles.google}>
                  G
                </b>
                CONTINUE WITH GOOGLE
              </button>

              <button
                type="button"
                className={styles.provider}
                onClick={() =>
                  social("Apple")
                }
              >
                <b className={styles.apple}>
                  
                </b>
                CONTINUE WITH APPLE
              </button>

              <button
                type="button"
                className={styles.provider}
                onClick={() =>
                  social("Facebook")
                }
              >
                <b className={styles.facebook}>
                  f
                </b>
                CONTINUE WITH FACEBOOK
              </button>

              <label
                className={
                  styles.remember
                }
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(
                      event.target.checked,
                    )
                  }
                />

                <span>
                  KEEP ME SIGNED IN
                </span>
              </label>

              {notice && (
                <div
                  className={
                    notice.type ===
                    "error"
                      ? styles.errorNotice
                      : styles.infoNotice
                  }
                >
                  {notice.type ===
                  "error" ? (
                    <LockKeyhole
                      size={15}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Check
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}

                  <span>
                    {notice.text}
                  </span>
                </div>
              )}
            </form>

            <p className={styles.terms}>
              By continuing, you agree to Vi2 account
              and privacy terms when account services
              are enabled.
            </p>
          </section>

          <aside className={styles.promise}>
            <div className={styles.promiseHeading}>
              <BadgeCheck
                size={22}
                strokeWidth={1.4}
              />

              <div>
                <span>VI2</span>
                <strong>
                  QUALITY PROMISE
                </strong>
              </div>
            </div>

            <p>
              Premium supplement shopping built
              around trust, clarity and a simpler
              customer journey.
            </p>

            <div className={styles.promiseGrid}>
              <div>
                <ShieldCheck
                  size={21}
                  strokeWidth={1.4}
                />

                <span>
                  AUTHENTIC
                  <br />
                  PRODUCTS
                </span>
              </div>

              <div>
                <BadgeCheck
                  size={21}
                  strokeWidth={1.4}
                />

                <span>
                  QUALITY-FOCUSED
                  <br />
                  SELECTION
                </span>
              </div>

              <div>
                <PackageCheck
                  size={21}
                  strokeWidth={1.4}
                />

                <span>
                  DELIVERY
                  <br />
                  ACROSS EGYPT
                </span>
              </div>

              <div>
                <LockKeyhole
                  size={21}
                  strokeWidth={1.4}
                />

                <span>
                  SECURE
                  <br />
                  CHECKOUT
                </span>
              </div>
            </div>

            <div className={styles.rewards}>
              <div className={styles.rewardsTitle}>
                <Sparkles
                  size={20}
                  strokeWidth={1.4}
                />

                <div>
                  <span>
                    VI2 REWARDS
                  </span>

                  <strong>
                    LIVE WELL.
                    GET REWARDED.
                  </strong>
                </div>
              </div>

              <ul>
                <li>
                  <Gift
                    size={15}
                    strokeWidth={1.4}
                  />
                  Collect points on eligible purchases
                </li>

                <li>
                  <RotateCcw
                    size={15}
                    strokeWidth={1.4}
                  />
                  Buy routine products again faster
                </li>

                <li>
                  <PackageCheck
                    size={15}
                    strokeWidth={1.4}
                  />
                  Keep orders organized in one place
                </li>
              </ul>

              <Link href="/account">
                EXPLORE ACCOUNT BENEFITS
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
