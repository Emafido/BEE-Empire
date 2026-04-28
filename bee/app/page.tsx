import TopNav from "@/components/navigation/TopNav";
import HeroSection from "@/components/hero/HeroSection";
import ProductGrid from "@/components/shop/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-boutique-light dark:bg-boutique-dark transition-colors duration-500">
      <TopNav />
      <HeroSection />
      <ProductGrid />
    </main>
  );
}