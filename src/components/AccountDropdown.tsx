"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  LogOut,
  PackageCheck,
  RotateCcw,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  getFrontendAccount,
  isFrontendSignedIn,
  signOutFrontend,
  type FrontendAccount,
} from "@/lib/frontendAuth";

import styles from "./AccountDropdown.module.css";

type Props = {
  open: boolean;
  isArabic: boolean;
  onClose: () => void;
};

export default function AccountDropdown({
  open,
  isArabic,
  onClose,
}: Props) {
  const [
    points,
    setPoints,
  ] = useState(0);

  const [
    user,
    setUser,
  ] =
    useState<FrontendAccount | null>(
      null,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    try {
      const raw =
        window.localStorage.getItem(
          "vi2-last-order",
        );

      if (!raw) {
        setPoints(0);
      } else {
        const order =
          JSON.parse(raw) as {
            total?: number;
          };

        setPoints(
          Math.floor(
            Number(
              order.total ?? 0,
            ) / 10,
          ),
        );
      }
    } catch {
      setPoints(0);
    }

    if (
      isFrontendSignedIn()
    ) {
      setUser(
        getFrontendAccount(),
      );
    } else {
      setUser(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const copy = isArabic
    ? {
        rewards: "مكافآت Vi2",
        points: "نقطة",
        rewardBody:
          "اجمع النقاط مع المشتريات المؤهلة واحصل على مزايا للأعضاء.",
        learn: "عرض حسابك",
        welcome: user
          ? "مرحباً بعودتك"
          : "مرحباً بك في Vi2",
        account: "حسابي",
        orders: "طلباتي",
        rewardsMenu: "مكافآتي",
        buyAgain: "اشترِ مرة أخرى",
        favourites: "المفضلة",
        signIn: "تسجيل الدخول / إنشاء حساب",
        signOut: "تسجيل الخروج",
      }
    : {
        rewards: "VI2 REWARDS",
        points: "POINTS",
        rewardBody:
          "Earn points on eligible purchases and unlock member benefits over time.",
        learn: "VIEW ACCOUNT",
        welcome: user
          ? "WELCOME BACK"
          : "WELCOME TO VI2",
        account: "My Account",
        orders: "My Orders",
        rewardsMenu: "My Rewards",
        buyAgain: "Buy It Again",
        favourites: "My Favourites",
        signIn: "SIGN IN / CREATE ACCOUNT",
        signOut: "SIGN OUT",
      };

  function signOut() {
    signOutFrontend();
    setUser(null);
    onClose();

    window.location.href =
      "/";
  }

  return (
    <div
      className={styles.dropdown}
      role="dialog"
      aria-label={copy.welcome}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className={styles.rewardsPanel}>
        <div className={styles.rewardIcon}>
          <Sparkles
            size={21}
            strokeWidth={1.35}
          />
        </div>

        <span>
          {copy.rewards}
        </span>

        <strong>
          {new Intl.NumberFormat(
            "en-EG",
          ).format(points)}
        </strong>

        <small>
          {copy.points}
        </small>

        <p>
          {copy.rewardBody}
        </p>

        <Link
          href="/account"
          onClick={onClose}
        >
          {copy.learn}
          <ArrowRight
            size={14}
            strokeWidth={1.5}
          />
        </Link>
      </section>

      <section className={styles.menuPanel}>
        <span className={styles.welcomeText}>
          {copy.welcome}
        </span>

        {user && (
          <div className={styles.signedInIdentity}>
            <strong>
              {user.fullName}
            </strong>
            <span>
              {user.email}
            </span>
          </div>
        )}

        <nav className={styles.menuLinks}>
          <Link
            href={
              user
                ? "/account"
                : "/account/sign-in?next=/account"
            }
            onClick={onClose}
          >
            <UserRound
              size={18}
              strokeWidth={1.4}
            />
            {copy.account}
          </Link>

          <Link
            href={
              user
                ? "/account"
                : "/account/sign-in?next=/account"
            }
            onClick={onClose}
          >
            <PackageCheck
              size={18}
              strokeWidth={1.4}
            />
            {copy.orders}
          </Link>

          <Link
            href={
              user
                ? "/account#rewards"
                : "/account/sign-in?next=/account%23rewards"
            }
            onClick={onClose}
          >
            <Star
              size={18}
              strokeWidth={1.4}
            />
            {copy.rewardsMenu}
          </Link>

          <Link
            href={
              user
                ? "/account#buy-again"
                : "/account/sign-in?next=/account%23buy-again"
            }
            onClick={onClose}
          >
            <RotateCcw
              size={18}
              strokeWidth={1.4}
            />
            {copy.buyAgain}
          </Link>

          <Link
            href="/shop"
            onClick={onClose}
          >
            <Heart
              size={18}
              strokeWidth={1.4}
            />
            {copy.favourites}
          </Link>
        </nav>

        {user ? (
          <button
            type="button"
            className={styles.signOutCta}
            onClick={signOut}
          >
            <LogOut
              size={15}
              strokeWidth={1.5}
            />
            {copy.signOut}
          </button>
        ) : (
          <Link
            href="/account/sign-in"
            className={styles.signInCta}
            onClick={onClose}
          >
            {copy.signIn}
          </Link>
        )}
      </section>
    </div>
  );
}
