"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, Search, Sun, Moon, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

// The streamlined navigation hub
const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Collection', href: '/collection' },
];

export default function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  
  // Pulling both the item count and the drawer trigger from Zustand
  const totalItems = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);

  // Prevent hydration errors
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Lock scrolling when the mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-5 md:px-12 py-5 bg-boutique-light dark:bg-boutique-dark sticky top-0 z-40 drop-shadow-sm transition-colors duration-500">
        
        {/* LEFT: Brand Logo */}
        <div className="shrink-0">
          <Link 
            href="/" 
            className="font-script text-4xl md:text-5xl font-bold tracking-wider text-neutral-900 dark:text-neutral-50 hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            BEE Empire&apos;s
          </Link>
        </div>

        {/* CENTER: Desktop Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-10 font-medium text-sm text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`${
                  isActive 
                    ? 'text-neutral-900 dark:text-neutral-50 font-bold border-b-2 border-amber-600 pb-1' 
                    : 'hover:text-amber-600 dark:hover:text-amber-500 transition-colors'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* RIGHT: Action Icons */}
        <div className="flex items-center gap-5 sm:gap-6 text-neutral-900 dark:text-neutral-50">
          
          {/* Desktop Theme Toggle */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:block hover:text-amber-600 dark:hover:text-amber-500 transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          )}

          {/* Desktop Search */}
          <Search className="w-6 h-6 hidden md:block cursor-pointer hover:text-amber-600 dark:hover:text-amber-500 transition-colors" />
          
          {/* Cart Trigger Button */}
          <button 
            onClick={openCart} 
            className="relative cursor-pointer group focus:outline-none"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="w-7 h-7 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors" />
            
            {/* The Gamified Counter Badge */}
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Menu Trigger */}
          <button 
            className="md:hidden flex items-center focus:outline-none hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-8 h-8" />
          </button>

        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-boutique-light dark:bg-boutique-dark flex flex-col items-center justify-center transition-colors duration-500">
          
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-neutral-900 dark:text-neutral-50 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-10 h-10" />
          </button>

          {/* Mobile Links */}
          <div className="flex flex-col items-center gap-8 text-2xl font-medium tracking-widest uppercase text-neutral-900 dark:text-neutral-50">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`${
                    isActive ? 'text-amber-600 dark:text-amber-500 font-bold' : 'hover:text-amber-600 transition-colors'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Theme Toggle */}
          <div className="absolute bottom-12 flex flex-col items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-neutral-500">Theme</p>
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-4 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 hover:border-amber-600 dark:hover:border-amber-500 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            )}
          </div>

        </div>
      )}
    </>
  );
}