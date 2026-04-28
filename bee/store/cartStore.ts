import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/components/shop/FashionCard';

// Upgrade CartItem to handle variations
export interface CartItem extends Product {
  cartItemId: string; 
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  // addItem now accepts the specific variants
  addItem: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      addItem: (product, quantity, color, size) => {
        const currentItems = get().items;
        // Create a unique ID based on the product AND its chosen variants
        const cartItemId = `${product.id}-${color || 'none'}-${size || 'none'}`;
        
        const existingItem = currentItems.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
          // If they already have this exact size and color, just increase the quantity
          set({
            items: currentItems.map((item) =>
              item.cartItemId === cartItemId 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            ),
            isCartOpen: true,
          });
        } else {
          // Otherwise, add it as a new distinct row
          set({ 
            items: [...currentItems, { ...product, cartItemId, quantity, selectedColor: color, selectedSize: size }],
            isCartOpen: true,
          });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((item) => item.cartItemId !== cartItemId) });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'bee-empire-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);