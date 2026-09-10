"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Beaker,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import styles from "./HomeHeroSlider.module.css";

const slides = [
  {
    image:
      "/hero/slider/vi2-hero-performance.webp",
    alt:
      "Vi2 performance supplements arranged on natural stone",
    label:
      "PERFORMANCE ESSENTIALS",
  },
  {
    image:
      "/hero/slider/vi2-hero-daily-wellness.webp",
    alt:
      "Vi2 daily wellness supplements with botanical styling",
    label:
      "DAILY WELLNESS",
  },
  {
    image:
      "/hero/slider/vi2-hero-sports.webp",
    alt:
      "Vi2 sports nutrition collection in a premium training setting",
    label:
      "SPORTS NUTRITION",
  },
  {
    image:
      "/hero/slider/vi2-hero-wellness.webp",
    alt:
      "Vi2 colorful everyday wellness supplements",
    label:
      "EVERYDAY WELLNESS",
  },
];

export default function HomeHeroSlider() {
  const [active, setActive] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const next = useCallback(() => {
    setActive(
      (current) =>
        (current + 1) %
        slides.length,
    );
  }, []);

  const previous =
    useCallback(() => {
      setActive(
        (current) =>
          (current -
            1 +
            slides.length) %
          slides.length,
      );
    }, []);

  useEffect(() => {
    if (paused) {
      return;
    }

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (reduceMotion) {
      return;
    }

    const timer =
      window.setInterval(
        next,
        5600,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, [
    next,
    paused,
  ]);

  return (
    <section
      className={styles.hero}
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      aria-roledescription="carousel"
      aria-label="Vi2 featured collections"
    >
      <div className={styles.copySide}>
        <div className={styles.copyInner}>
          <div
            className={styles.vi2Wordmark}
            aria-label="Vi2"
          >
            <span>V</span>
            <span>i</span>
            <span>2</span>
          </div>

          <span
            className={styles.eyebrow}
          >
            {slides[active].label}
          </span>

          <h1>
            LIVE WELL,
            <br />
            LIVE FULLY.
          </h1>

          <p>
            Premium supplements,
            rooted in wellness and
            backed by quality.
          </p>

          <Link
            href="/shop"
            className={styles.shopButton}
          >
            SHOP NOW

            <ArrowRight
              size={17}
              strokeWidth={1.6}
            />
          </Link>

          <div className={styles.trust}>
            <div>
              <Leaf
                size={21}
                strokeWidth={1.35}
              />

              <span>
                TRUSTED
                <br />
                QUALITY
              </span>
            </div>

            <div>
              <Beaker
                size={21}
                strokeWidth={1.35}
              />

              <span>
                SCIENCE-
                <br />
                FOCUSED
              </span>
            </div>

            <div>
              <ShieldCheck
                size={21}
                strokeWidth={1.35}
              />

              <span>
                A HEALTHIER
                <br />
                TOMORROW
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.visualSide}>
        {slides.map(
          (
            slide,
            index,
          ) => (
            <div
              key={slide.image}
              className={
                index === active
                  ? `${styles.slide} ${styles.slideActive}`
                  : styles.slide
              }
              aria-hidden={
                index !== active
              }
            >
              <Image
                src={slide.image}
                alt={
                  index === active
                    ? slide.alt
                    : ""
                }
                fill
                priority={
                  index === 0
                }
                quality={100}
                sizes="(max-width: 700px) 100vw, 58vw"
                className={styles.slideImage}
              />
            </div>
          ),
        )}

        <div
          className={
            styles.visualShade
          }
        />

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label="Previous slide"
          onClick={previous}
        >
          <ArrowLeft
            size={21}
            strokeWidth={1.5}
          />
        </button>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label="Next slide"
          onClick={next}
        >
          <ArrowRight
            size={21}
            strokeWidth={1.5}
          />
        </button>

        <div
          className={styles.dots}
          role="tablist"
          aria-label="Hero slides"
        >
          {slides.map(
            (
              slide,
              index,
            ) => (
              <button
                key={slide.image}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-selected={
                  index === active
                }
                className={
                  index === active
                    ? styles.dotActive
                    : styles.dot
                }
                onClick={() =>
                  setActive(index)
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
