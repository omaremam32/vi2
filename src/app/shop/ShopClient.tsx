"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

import styles from "./Shop.module.css";

const categories = [
  "All",
  "Protein",
  "Creatine",
  "Pre-Workout",
  "Vitamins",
  "Wellness",
  "Mass Gainer",
];

const brands = [
  "All Brands",
  ...Array.from(
    new Set(products.map((product) => product.brand)),
  ).sort(),
];

type SortValue =
  | "featured"
  | "price-low"
  | "price-high"
  | "rating";

export default function ShopClient() {
  const searchParams = useSearchParams();

  const requestedCategory =
    searchParams.get("category");

  const validRequestedCategory =
    requestedCategory &&
    categories.includes(requestedCategory)
      ? requestedCategory
      : "All";

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState(validRequestedCategory);

  const [brand, setBrand] =
    useState("All Brands");

  const [sort, setSort] =
    useState<SortValue>("featured");

  useEffect(() => {
    setCategory(validRequestedCategory);
  }, [validRequestedCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const result = products.filter(
      (product) => {
        const matchesCategory =
          category === "All" ||
          product.category === category;

        const matchesBrand =
          brand === "All Brands" ||
          product.brand === brand;

        const searchableText = [
          product.name,
          product.shortName,
          product.brand,
          product.category,
          product.flavor ?? "",
          product.size ?? "",
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableText.includes(
            normalizedSearch,
          );

        return (
          matchesCategory &&
          matchesBrand &&
          matchesSearch
        );
      },
    );

    if (sort === "price-low") {
      return [...result].sort(
        (a, b) => a.price - b.price,
      );
    }

    if (sort === "price-high") {
      return [...result].sort(
        (a, b) => b.price - a.price,
      );
    }

    if (sort === "rating") {
      return [...result].sort(
        (a, b) =>
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount,
      );
    }

    return result;
  }, [
    brand,
    category,
    search,
    sort,
  ]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setBrand("All Brands");
    setSort("featured");
  }

  const hasActiveFilters =
    search.trim().length > 0 ||
    category !== "All" ||
    brand !== "All Brands" ||
    sort !== "featured";

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.introCopy}>
          <span className={styles.eyebrow}>
            VI2 COLLECTION
          </span>

          <h1>SHOP</h1>

          <p>
            Supplements and wellness essentials,
            organized for a faster, simpler way
            to shop.
          </p>
        </div>

        <div className={styles.introWord}>
          VI2
        </div>
      </section>

      <section className={styles.controlSection}>
        <div className={styles.searchRow}>
          <label className={styles.searchBox}>
            <Search
              size={19}
              strokeWidth={1.5}
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products, brands or categories"
              aria-label="Search products"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X
                  size={17}
                  strokeWidth={1.5}
                />
              </button>
            )}
          </label>

          <div className={styles.selectGroup}>
            <label className={styles.selectWrap}>
              <span>BRAND</span>

              <select
                value={brand}
                onChange={(event) =>
                  setBrand(event.target.value)
                }
              >
                {brands.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.selectWrap}>
              <span>SORT</span>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target
                      .value as SortValue,
                  )
                }
              >
                <option value="featured">
                  Featured
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>
              </select>
            </label>
          </div>
        </div>

        <div className={styles.categories}>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? styles.categoryActive
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.results}>
        <div className={styles.resultsTop}>
          <div className={styles.resultCount}>
            <SlidersHorizontal
              size={15}
              strokeWidth={1.5}
            />

            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "PRODUCT"
                : "PRODUCTS"}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearFilters}
            >
              CLEAR FILTERS
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ),
            )}
          </div>
        ) : (
          <div className={styles.empty}>
            <span>NO MATCHES</span>

            <h2>
              Nothing found.
            </h2>

            <p>
              Try another product name,
              category or brand.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              VIEW ALL PRODUCTS
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
