"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FashionCard, { Product } from "./FashionCard";
import { Loader2 } from "lucide-react";

interface ApiProduct {
  ID: number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  image_url?: string;
  isNew?: boolean;
  is_new?: boolean;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        const latestProducts = data.reverse().slice(0, 4);
        
        const formattedProducts: Product[] = latestProducts.map((item: ApiProduct, index: number) => {
          // Aggressive check: Ensure it's actually a string and not empty before assigning
          const rawImg = item.imageUrl || item.image_url;
          const finalImage = (typeof rawImg === 'string' && rawImg.trim() !== "") 
            ? rawImg 
            : "/mock-1.jpg";

          return {
            id: item.ID ? String(item.ID) : `fallback-id-${index}`,
            name: item.name || "Untitled Drop",
            price: item.price || 0,
            category: item.category || "Uncategorized",
            imageUrl: finalImage,
            isNew: item.isNew || item.is_new || false,
          };
        });

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
    <section className="w-full max-w-7xl mx-auto px-5 md:px-12 py-20 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">Latest Arrivals</h2>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">Curated pieces for the bold.</p>
        </div>
        <Link 
          href="/collection"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
        >
          View All
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-amber-600 dark:text-amber-500 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 animate-pulse">Loading Drops...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product) => (
            <FashionCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}