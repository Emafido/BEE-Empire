"use client";

import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, ArrowRight, X, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isCartOpen, closeCart, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  if (!mounted) return null;

  // Adjusted the threshold to better match her ₦11k-₦14.5k price point
  const FREE_SHIPPING_THRESHOLD = 50000;
  const currentTotal = totalPrice();
  const progressPercentage = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const isFreeShippingUnlocked = currentTotal >= FREE_SHIPPING_THRESHOLD;

  const generateWhatsAppLink = () => {
    const phoneNumber = "2348000000000"; // Replace with her actual number
    let text = "Hello BEE Empire's! 🖤\nI would like to place an order for:\n\n";
    
    items.forEach((item) => {
      // Intelligently format the variants if they exist
      const variants = [item.selectedColor, item.selectedSize].filter(Boolean).join(" / ");
      const variantText = variants ? ` (${variants})` : "";
      
      text += `${item.quantity}x ${item.name}${variantText} - ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    text += `\n*Order Total: ₦${currentTotal.toLocaleString()}*`;
    if (isFreeShippingUnlocked) text += `\n*(Qualifies for Free VIP Shipping!)*`;
    text += `\n\nAre these items available?`;
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-60 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-boutique-light dark:bg-boutique-dark z-70 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-neutral-900 dark:text-neutral-50" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50">Your Bag ({totalItems()})</h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-neutral-500" />
          </button>
        </div>

        {/* Gamification Bar */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              {isFreeShippingUnlocked ? <span className="text-green-600 dark:text-green-500">Free Shipping Unlocked!</span> : `Add ₦${(FREE_SHIPPING_THRESHOLD - currentTotal).toLocaleString()} for Free Shipping`}
            </p>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${isFreeShippingUnlocked ? 'bg-green-500' : 'bg-amber-600 dark:bg-amber-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Items Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag className="w-16 h-16 text-neutral-400" />
              <p className="text-sm font-medium uppercase tracking-widest">Your bag is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4">
                <div className="relative w-20 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-sm overflow-hidden shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 leading-tight">{item.name}</h3>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1 flex flex-wrap gap-1">
                      <span>{item.category}</span>
                      {item.selectedColor && <span> • {item.selectedColor}</span>}
                      {item.selectedSize && <span> • Size {item.selectedSize}</span>}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-500">₦{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-neutral-500">QTY: {item.quantity}</span>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Button */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1A1715]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">Subtotal</span>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">₦{currentTotal.toLocaleString()}</span>
          </div>
          <Link 
            href={items.length > 0 ? generateWhatsAppLink() : "#"}
            target={items.length > 0 ? "_blank" : undefined}
            onClick={items.length === 0 ? (e) => e.preventDefault() : undefined}
            className={`w-full py-4 font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-lg ${items.length > 0 ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-[0.98]' : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
          >
            Checkout via WhatsApp
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </>
  );
}