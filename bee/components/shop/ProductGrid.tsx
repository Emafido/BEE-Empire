"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QuickShopModal from "./QuickShopModal";

interface Product {
  ID: number;
  name?: string; Name?: string;
  price?: number; Price?: number;
  category?: string; Category?: string;
  imageUrl?: string; ImageUrl?: string;
  colors?: string; Colors?: string;
  sizes?: string; Sizes?: string;
  stock?: number; Stock?: number;
  isNew?: boolean; IsNew?: boolean;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/products?t=" + new Date().getTime(), { 
      cache: "no-store" 
    })
      .then(res => res.json())
      .then(data => setProducts(data || []))
      .catch(err => console.error("Failed to load store drops:", err));
  }, []);

  const openPopup = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">Latest Arrivals</h2>
        <p className="text-neutral-500 uppercase tracking-widest text-sm">Shop the newest additions to our collection.</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-neutral-400 font-bold uppercase tracking-widest mt-20 animate-pulse">Loading Drops...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const pName = product.name || product.Name || "";
            const pPrice = product.price || product.Price || 0;
            const pImageUrl = product.imageUrl || product.ImageUrl || "";
            const pIsNew = product.isNew ?? product.IsNew ?? false;

            return (
              <div key={product.ID} className="group cursor-pointer" onClick={() => openPopup(product)}>
                {/* FIXED: Tailwind canonical class aspect-3/4 and forced inline position */}
                <div 
                  className="aspect-3/4 bg-neutral-200 dark:bg-neutral-800 mb-4 overflow-hidden relative" 
                  style={{ position: 'relative' }}
                >
                  {pIsNew && (
                    <span className="absolute top-3 left-3 z-20 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 tracking-widest">
                      New
                    </span>
                  )}
                  {pImageUrl && (
                    <Image 
                      src={pImageUrl} 
                      alt={pName} 
                      fill 
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 z-10"
                    />
                  )}
                  
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <button className="w-full bg-white/90 backdrop-blur-sm text-black font-bold uppercase text-xs tracking-widest py-3 hover:bg-black hover:text-white transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">{pName}</h3>
                  <p className="text-amber-600 font-bold mt-1">₦{pPrice.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickShopModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
      />
    </section>
  );
}