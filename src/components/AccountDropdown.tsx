"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
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
  const [points, setPoints] =
    useState(0);

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
        return;
      }

      const order =
        JSON.parse(raw) as {
          total?: number;
        };

      setPoints(
        Math.floor(
          Number(order.total ?? 0) /
            10,
        ),
      );
    } catch {
      setPoints(0);
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
        welcome: "مرحباً بك في Vi2",
        account: "حسابي",
        orders: "طلباتي",
        rewardsMenu: "مكافآتي",
        buyAgain: "اشترِ مرة أخرى",
        favourites: "المفضلة",
        signIn:
          "تسجيل الدخول / إنشاء حساب",
      }
    : {
        rewards: "VI2 REWARDS",
        points: "POINTS",
        rewardBody:
          "Earn points on eligible purchases and unlock member benefits over time.",
        learn: "VIEW ACCOUNT",
        welcome: "WELCOME TO VI2",
        account: "My Account",
        orders: "My Orders",
        rewardsMenu: "My Rewards",
        buyAgain: "Buy It Again",
        favourites: "My Favourites",
        signIn:
          "SIGN IN / CREATE ACCOUNT",
      };

  return (
    <div
      className={styles.dropdown}
      role="dialog"
      aria-label={copy.welcome}
    >
      <section
        className={
          styles.rewardsPanel
        }
      >
        <div className={styles.rewardIcon}>
          <Sparkles
            size={21}
            strokeWidth={1.35}
          />
        </div>

        <span>{copy.rewards}</span>

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
        <span
          className={
            styles.welcomeText
          }
        >
          {copy.welcome}
        </span>

        <nav className={styles.menuLinks}>
          <Link
            href="/account"
            onClick={onClose}
          >
            <UserRound
              size={18}
              strokeWidth={1.4}
            />
            {copy.account}
          </Link>

          <Link
            href="/account"
            onClick={onClose}
          >
            <PackageCheck
              size={18}
              strokeWidth={1.4}
            />
            {copy.orders}
          </Link>

          <Link
            href="/account"
            onClick={onClose}
          >
            <Star
              size={18}
              strokeWidth={1.4}
            />
            {copy.rewardsMenu}
          </Link>

          <Link
            href="/account"
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

        <Link
          href="/account/sign-in"
          className={styles.signInCta}
          onClick={onClose}
        >
          {copy.signIn}
        </Link>
      </section>
    </div>
  );
}
