"use client";

import { useState, useMemo, useEffect } from "react";
import TopNav from "@/components/navigation/TopNav";
import FashionCard, { Product } from "@/components/shop/FashionCard";
import { Loader2 } from "lucide-react";

// Strict TypeScript interface for the Go API response
// We include variations of uppercase/lowercase to catch however Go sends the JSON
interface ApiProduct {
  ID: number;
  name?: string; Name?: string;
  price?: number; Price?: number;
  category?: string; Category?: string;
  imageUrl?: string; image_url?: string; ImageUrl?: string;
  isNew?: boolean; is_new?: boolean; IsNew?: boolean;
  stock?: number; Stock?: number;
  quantity?: number; Quantity?: number;
  colors?: string; Colors?: string; // Essential for the modal options
  sizes?: string; Sizes?: string;   // Essential for the modal options
}

export default function CollectionPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://bee-empire.onrender.com/products?t=" + new Date().getTime(), {
          cache: "no-store"
        });
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        
        const formattedProducts: Product[] = data.map((item: ApiProduct) => ({
          ID: item.ID,
          name: item.name || item.Name || "",
          price: item.price || item.Price || 0,
          category: item.category || item.Category || "Uncategorized",
          imageUrl: item.imageUrl || item.image_url || item.ImageUrl || "/mock-1.jpg", 
          isNew: item.isNew || item.is_new || item.IsNew || false,
          
          // THE FIX: Grabbing the strict modal data
          stock: item.stock ?? item.Stock ?? item.quantity ?? item.Quantity ?? 10, 
          colors: item.colors || item.Colors || "", 
          sizes: item.sizes || item.Sizes || "",
        }));

        formattedProducts.reverse();
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const dynamicCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map((p) => p.category || p.Category || ""))).filter(c => c !== "");
    return ["All", ...uniqueCats.sort()];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter((p) => (p.category || p.Category) === activeCategory);
    }

    result = [...result].sort((a, b) => {
      const priceA = Number(a.price ?? a.Price ?? 0);
      const priceB = Number(b.price ?? b.Price ?? 0);
      const isNewA = a.isNew ?? a.IsNew ?? false;
      const isNewB = b.isNew ?? b.IsNew ?? false;

      if (sortOrder === "price-low") return priceA - priceB;
      if (sortOrder === "price-high") return priceB - priceA;
      if (sortOrder === "newest") {
        return (isNewA === isNewB) ? 0 : isNewA ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [products, activeCategory, sortOrder]);

  return (
    <main className="min-h-screen bg-boutique-light dark:bg-boutique-dark transition-colors duration-500">
      <TopNav />
      
      <section className="w-full max-w-7xl mx-auto px-5 md:px-12 pt-16 md:pt-24 pb-8 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-neutral-900 dark:text-neutral-50 mb-4 font-script">
          The Full Drop
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-xl text-lg font-medium">
          Every piece in our current rotation. Highly limited stock. Once it&apos;s gone, it&apos;s gone.
        </p>
      </section>

      <section className="w-full max-w-7xl mx-auto px-5 md:px-12 pb-32 animate-in fade-in duration-1000 delay-300">
        
        <div className="flex justify-between items-center py-6 border-t border-neutral-200 dark:border-neutral-800 relative">
          <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">
            {isLoading ? "Loading..." : `${filteredAndSortedProducts.length} Items`}
          </span>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 hover:text-amber-600 dark:hover:text-amber-500 transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isFilterOpen ? "Close Controls -" : "Sort / Filter +"}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? "max-h-96 opacity-100 mb-12" : "max-h-0 opacity-0 m-0"}`}>
          <div className="bg-neutral-100 dark:bg-[#1A1715] p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8 rounded-sm">
            
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Category</p>
              <div className="flex flex-wrap gap-3">
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                      activeCategory === cat 
                      ? "bg-neutral-900 dark:bg-amber-600 text-white dark:text-neutral-900" 
                      : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:w-64">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Sort By</p>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border-none p-3 text-sm font-bold uppercase tracking-widest focus:ring-2 focus:ring-amber-600 outline-none cursor-pointer"
              >
                <option value="newest">Newest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-amber-600 dark:text-amber-500 animate-spin" />
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 animate-pulse">Pulling Inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <FashionCard key={product.ID} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium">No pieces found in this category.</p>
              </div>
            )}
          </div>
        )}
        
      </section>
    </main>
  );
}