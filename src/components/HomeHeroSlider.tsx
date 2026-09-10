"use client";

import Image from "next/image";
import {
  Dumbbell,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./HomeHeroSlider.module.css";

const slides = [
  {
    image:
      "/hero/slider-v9/performance.webp",
    alt:
      "Vi2 performance supplement collection",
  },
  {
    image:
      "/hero/slider-v9/daily-wellness.webp",
    alt:
      "Vi2 daily wellness supplement collection",
  },
  {
    image:
      "/hero/slider-v9/sports.webp",
    alt:
      "Vi2 sports nutrition supplement collection",
  },
  {
    image:
      "/hero/slider-v9/wellness.webp",
    alt:
      "Vi2 everyday wellness supplement collection",
  },
];

export default function HomeHeroSlider() {
  const [active, setActive] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const next = useCallback(() => {
    setActive(
      (current) =>
        (current + 1) %
        slides.length,
    );
  }, []);

  const previous = useCallback(() => {
    setActive(
      (current) =>
        (current - 1 + slides.length) %
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
        2000,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, [
    next,
    paused,
  ]);

  function handleTouchStart(
    event: React.TouchEvent<HTMLElement>,
  ) {
    const x = event.touches[0]?.clientX ?? null;

    touchStartX.current = x;
    touchCurrentX.current = x;

    setPaused(true);
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLElement>,
  ) {
    touchCurrentX.current =
      event.touches[0]?.clientX ??
      touchCurrentX.current;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchCurrentX.current === null
    ) {
      setPaused(false);
      return;
    }

    const distance =
      touchCurrentX.current -
      touchStartX.current;

    const swipeThreshold = 45;

    if (distance <= -swipeThreshold) {
      next();
    } else if (distance >= swipeThreshold) {
      previous();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;

    window.setTimeout(
      () => setPaused(false),
      220,
    );
  }

  return (
    <section
      className={styles.hero}
      aria-label="Vi2 featured collections"
      aria-roledescription="carousel"
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={styles.identity}>
        <div className={styles.identityInner}>
          <div className={styles.brandRow}>
            <Image
              src="/brand/vi2-wordmark-packaging.png"
              alt="Vi2"
              width={164}
              height={66}
              priority
              className={styles.wordmarkImage}
            />

            <span
              className={styles.brandDivider}
            />

            <span
              className={styles.brandDescriptor}
            >
              MORE THAN
              <br />
              SUPPLEMENTS
            </span>

            <span
              className={styles.brandRule}
            />
          </div>

          <h1>
            <span>
              LIVE WELL,
            </span>

            <strong>
              LIVE FULLY.
            </strong>
          </h1>

          <p className={styles.statement}>
            PREMIUM SUPPLEMENTS
            <br />
            FOR A STRONGER, HEALTHIER YOU.
          </p>

          <div className={styles.values}>
            <div>
              <Leaf
                size={25}
                strokeWidth={1.35}
              />

              <span>
                HIGH
                <br />
                QUALITY
              </span>
            </div>

            <div>
              <Dumbbell
                size={25}
                strokeWidth={1.35}
              />

              <span>
                REAL
                <br />
                RESULTS
              </span>
            </div>

            <div>
              <ShieldCheck
                size={25}
                strokeWidth={1.35}
              />

              <span>
                TRUSTED
                <br />
                BRANDS
              </span>
            </div>

            <div>
              <Sparkles
                size={25}
                strokeWidth={1.35}
              />

              <span>
                A HEALTHIER
                <br />
                TOMORROW
              </span>
            </div>
          </div>

          <div className={styles.footerLine}>
            <span />

            <small>
              SUPPLEMENTS FOR A
              BRIGHTER YOU
            </small>

            <span />
          </div>
        </div>
      </div>

      <div className={styles.visual}>
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
                sizes="(max-width: 760px) 100vw, 58vw"
                className={styles.slideImage}
              />
            </div>
          ),
        )}

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
