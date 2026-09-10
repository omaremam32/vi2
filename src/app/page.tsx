import FlashDeals from "@/components/FlashDeals";
import HomeDiscovery from "@/components/HomeDiscovery";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import TrendingNow from "@/components/TrendingNow";
import ValueSets from "@/components/ValueSets";

export default function Home() {
  return (
    <main>
      {/* ======================================================
          VI2 PHOTO HERO SLIDER
          ====================================================== */}
      <HomeHeroSlider />

      {/* ======================================================
          BEST SELLERS + HEALTH GOALS + BRANDS
          ====================================================== */}
      <HomeDiscovery />

      {/* ======================================================
          FLASH DEALS
          ====================================================== */}
      <FlashDeals />

      {/* ======================================================
          VALUE SETS / BUNDLES
          ====================================================== */}
      <ValueSets />

      {/* ======================================================
          TRENDING NOW
          ====================================================== */}
      <TrendingNow />

      {/* ======================================================
          FINAL BRAND STATEMENT
          ====================================================== */}
      <section className="brand-statement">
        <span>
          LIVE WELL, LIVE FULLY.
        </span>

        <p>
          VI2 · DIETARY & WELLNESS SUPPLEMENTS
        </p>
      </section>
    </main>
  );
}
