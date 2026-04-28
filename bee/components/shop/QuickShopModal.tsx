"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "./FashionCard";

interface QuickShopModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_COLORS = ["Black", "Nude", "Sky Blue", "Brown"];
const FALLBACK_SIZES = ["S", "M", "L", "XL"];

export default function QuickShopModal({ product, isOpen, onClose }: QuickShopModalProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Strictly lock the body scroll and handle cleanup
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;
    addItem(product, quantity, selectedColor, selectedSize);
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
    onClose();
  };

  const isReadyToAdd = selectedColor && selectedSize;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* 1. Static Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Scrollable Container for the Modal itself */}
      <div className="fixed inset-0 overflow-y-auto overscroll-none">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          
          {/* 3. The Actual Modal Panel */}
          <div className="relative w-full max-w-4xl bg-boutique-light dark:bg-boutique-dark text-left shadow-2xl animate-in zoom-in-95 duration-300 my-8 flex flex-col md:flex-row overflow-hidden rounded-sm">
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 h-[400px] md:h-auto relative bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover object-top"
              />
            </div>

            {/* Right Side: Controls */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">{product.category}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 leading-tight">{product.name}</h2>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500 mb-8">₦{product.price.toLocaleString()}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50">
                    Color: <span className="text-neutral-500">{selectedColor || "Select"}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {FALLBACK_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border ${
                        selectedColor === color 
                          ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" 
                          : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-white"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50">
                    Size: <span className="text-neutral-500">{selectedSize || "Select"}</span>
                  </span>
                  <button className="text-xs font-bold underline text-amber-600 dark:text-amber-500">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {FALLBACK_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border text-sm font-bold uppercase transition-all ${
                        selectedSize === size 
                          ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" 
                          : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 block mb-3">Quantity</span>
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 w-28 sm:w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={!isReadyToAdd}
                className={`w-full py-4 mt-auto font-bold uppercase tracking-widest text-xs sm:text-sm transition-all shadow-lg ${
                  isReadyToAdd 
                    ? "bg-amber-600 hover:bg-amber-500 text-white cursor-pointer active:scale-[0.98]" 
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                }`}
              >
                {isReadyToAdd ? `Add to Bag - ₦${(product.price * quantity).toLocaleString()}` : "Select Options"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}