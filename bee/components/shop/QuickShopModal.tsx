"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";

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

interface QuickShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickShopModal({ isOpen, onClose, product }: QuickShopModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const pName = product?.name || product?.Name || "";
  const pPrice = Number(product?.price ?? product?.Price ?? 0);
  const pCategory = product?.category || product?.Category || "";
  const pImageUrl = product?.imageUrl || product?.ImageUrl || "";
  const rawColors = product?.colors || product?.Colors || "";
  const rawSizes = product?.sizes || product?.Sizes || "";
  const pStock = Number(product?.stock ?? product?.Stock ?? 0);

  // 1. THE BODY SCROLL LOCK FIX
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function in case the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (product && isOpen) {
      const colorsArr = rawColors ? rawColors.split(',').map(c => c.trim()).filter(Boolean) : [];
      const sizesArr = rawSizes ? rawSizes.split(',').map(s => s.trim()).filter(Boolean) : [];

      const timer = setTimeout(() => {
        if (colorsArr.length > 0) setSelectedColor(colorsArr[0]);
        if (sizesArr.length > 0) setSelectedSize(sizesArr[0]);
        setQuantity(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [product, isOpen, rawColors, rawSizes]);

  if (!isOpen || !product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < pStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const availableColors = rawColors ? rawColors.split(',').map(c => c.trim()).filter(Boolean) : [];
  const availableSizes = rawSizes ? rawSizes.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-sm transition-opacity"
      onClick={handleClose}
    >
      <div 
        className="bg-[#121212] w-full max-w-5xl max-h-[90vh] rounded-md overflow-hidden flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-100 bg-black/80 hover:bg-red-600 p-2 rounded-full transition-colors text-white border border-neutral-700 hover:border-red-600 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* IMAGE FIX: Shrunk to h-48 on mobile to save space, completely proportional on desktop */}
        <div 
          className="w-full md:w-1/2 h-48 md:h-auto md:min-h-120 bg-neutral-900 relative shrink-0 p-4"
          style={{ position: 'relative' }}
        >
          {pImageUrl ? (
            <Image 
              src={pImageUrl} 
              alt={pName} 
              fill 
              priority
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-contain" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-700 uppercase tracking-widest text-xs font-bold">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS FIX: Tightened paddings (p-5 md:p-8) and margins to condense content */}
        <div className="w-full md:w-1/2 flex-1 flex flex-col overflow-y-auto p-5 md:p-8 text-white">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1 shrink-0">
            {pCategory}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-1 pr-8 shrink-0">{pName}</h2>
          <p className="text-xl md:text-2xl font-bold text-amber-500 mb-4 md:mb-5 shrink-0">₦{pPrice.toLocaleString()}</p>

          {availableColors.length > 0 && (
            <div className="mb-4 shrink-0">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Color: <span className="text-white ml-2">{selectedColor || 'SELECT'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                      selectedColor === color 
                        ? "border-amber-500 text-amber-500 bg-amber-500/10" 
                        : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className="mb-4 shrink-0">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Size: <span className="text-white ml-2">{selectedSize || 'SELECT'}</span>
                </p>
                <button className="text-[10px] md:text-xs text-amber-500 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 flex items-center justify-center border text-[10px] md:text-xs font-bold uppercase transition-all ${
                      selectedSize === size 
                        ? "border-amber-500 text-amber-500 bg-amber-500/10" 
                        : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 shrink-0">
            <div className="flex justify-between items-end mb-2">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">Quantity</p>
              <p className={`text-[10px] md:text-xs font-bold ${pStock > 0 ? "text-green-500" : "text-red-500"}`}>
                {pStock > 0 ? `${pStock} Units Available` : "Sold Out"}
              </p>
            </div>
            
            <div className="flex items-center w-28 md:w-32 border border-neutral-700 mb-4 md:mb-5">
              <button 
                onClick={handleDecrease} 
                disabled={quantity <= 1 || pStock === 0}
                className="w-8 md:w-10 h-10 flex items-center justify-center hover:bg-neutral-800 disabled:opacity-50 transition-colors"
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4 text-neutral-400" />
              </button>
              
              <div className="flex-1 text-center font-bold text-sm">
                {pStock === 0 ? 0 : quantity}
              </div>
              
              <button 
                onClick={handleIncrease}
                disabled={quantity >= pStock || pStock === 0} 
                className="w-8 md:w-10 h-10 flex items-center justify-center hover:bg-neutral-800 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 text-neutral-400" />
              </button>
            </div>

            <button 
              disabled={pStock === 0}
              className="w-full bg-[#1A1A1A] hover:bg-amber-600 text-white py-3 font-bold uppercase tracking-widest text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-800 hover:border-amber-600"
            >
              {pStock > 0 ? 'Select Options' : 'Out of Stock'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}