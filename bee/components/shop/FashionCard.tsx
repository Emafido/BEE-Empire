"use client";

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import QuickShopModal from './QuickShopModal';

// BULLETPROOF INTERFACE: Matches QuickShopModal and the Go Backend exactly
export interface Product {
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

interface FashionCardProps {
  product: Product;
}

export default function FashionCard({ product }: FashionCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize data to handle both local dev and Go's capitalized JSON
  const pName = product.name || product.Name || "";
  const pPrice = Number(product.price ?? product.Price ?? 0);
  const pCategory = product.category || product.Category || "";
  const pImageUrl = product.imageUrl || product.ImageUrl || "";
  const pIsNew = product.isNew ?? product.IsNew ?? false;

  return (
    <>
      <div className="group relative flex flex-col">
        {/* Image Container */}
        <div 
          className="relative w-full aspect-3/4 bg-neutral-200 dark:bg-neutral-800 overflow-hidden mb-4 rounded-sm"
          style={{ position: 'relative' }} // Force relative for Next.js Image
        >
          {pIsNew && (
            <span className="absolute top-4 left-4 z-20 bg-neutral-900 dark:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md">
              New Drop
            </span>
          )}
          
          <div className={`w-full h-full ${imageError ? 'animate-pulse' : ''}`}>
            {/* The image itself is now clickable on mobile as a fallback */}
            <div className="w-full h-full cursor-pointer md:cursor-default" onClick={() => setIsModalOpen(true)}>
              {pImageUrl ? (
                <Image
                  src={pImageUrl}
                  alt={pName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-bold uppercase">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* MOBILE FIX: Persistent floating action button on small screens */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg md:hidden z-20 active:scale-95 transition-transform"
            aria-label="Select Options"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* DESKTOP UX: Hover Overlay Button */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex flex-col justify-end p-4 pointer-events-none">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full pointer-events-auto bg-white text-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-100 shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Select Options
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 tracking-wide hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {pName}
            </h3>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
              {pCategory}
            </p>
          </div>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-500">
            ₦{pPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <QuickShopModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}