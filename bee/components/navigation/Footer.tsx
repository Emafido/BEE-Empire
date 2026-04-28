import Link from "next/link";
// Removed Facebook, Twitter, and Instagram from here. Only kept ArrowRight.
import { ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-boutique-light dark:bg-boutique-dark border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500 pt-20 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-5 md:px-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start">
            <Link 
              href="/" 
              className="font-script text-4xl md:text-5xl font-bold tracking-wider text-neutral-900 dark:text-neutral-50 mb-6"
            >
              BEE Empire&apos;s
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium max-w-xs mb-6">
              Premium fits for the unapologetic. Command the room before you even speak.
            </p>
            <div className="flex items-center gap-4 text-neutral-900 dark:text-neutral-50">
              
              {/* Custom SVG for Instagram */}
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Custom SVG for Twitter (X) */}
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>

              {/* Custom SVG for Facebook */}
              <a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 mb-6">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              <li><Link href="/collection" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">All Products</Link></li>
              <li><Link href="/collection" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">New Arrivals</Link></li>
              <li><Link href="/collection" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Best Sellers</Link></li>
              <li><Link href="/collection" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 mb-6">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              <li><Link href="/about" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-50 mb-6">VIP Access</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-4">
              Subscribe to get early access to limited drops and exclusive sales.
            </p>
            <form className="flex items-center border-b border-neutral-300 dark:border-neutral-700 py-2 group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500"
                required
              />
              <button 
                type="submit" 
                className="text-neutral-500 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors ml-2"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-200 dark:border-neutral-800 text-xs font-bold uppercase tracking-widest text-neutral-500">
          <p>&copy; {currentYear} BEE Empire&apos;s. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}