"use client";

import styles from "./BrandUniverse.module.css";

const brands = [
  "Nutri-Nations",
  "Doctor's Best",
  "NOW Foods",
  "California Gold Nutrition",
  "Optimum Nutrition",
  "Big Ramy Labs",
];

const repeatedBrands = [
  ...brands,
  ...brands,
];

export default function BrandUniverse() {
  return (
    <section
      id="brands"
      className={styles.section}
      aria-label="Vi2 brands"
    >
      <div
        className={styles.marquee}
        aria-hidden="true"
      >
        <div className={styles.track}>
          {repeatedBrands.map(
            (brand, index) => (
              <div
                key={`${brand}-${index}`}
                className={styles.item}
              >
                <span>
                  {brand}
                </span>

                <i />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
