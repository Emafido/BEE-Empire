"use client";

import FashionCard, { Product } from "./FashionCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        
        // Map the data and slice only the first 4 for the home page preview
        const formattedProducts: Product[] = data.slice(0, 4).map((item: any) => ({
          id: String(item.ID),
          name: item.name,
          price: item.price,
          category: item.category,
          imageUrl: item.image_url,
          isNew: item.is_new,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error loading latest arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section id="collection" className="w-full max-w-7xl mx-auto px-5 md:px-12 py-24 min-h-[60vh]">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-neutral-900 dark:text-neutral-50">
            Latest Arrivals
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400 tracking-wide">
            Curated pieces for the bold.
          </p>
        </div>
        <Link 
          href="/collection" 
          className="text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-900 dark:border-neutral-50 pb-1 hover:text-amber-600 dark:hover:text-amber-500 hover:border-amber-600 dark:hover:border-amber-500 transition-colors whitespace-nowrap ml-4"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-amber-600 dark:text-amber-500 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 animate-pulse">
            Loading latest drops...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <FashionCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}