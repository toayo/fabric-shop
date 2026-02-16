import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartUnit = "yard" | "meter" | "spool";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string | null;
  color: string | null;
  unit: CartUnit;
  length: number;
  priceAtAdd: number;
  currency: "JMD" | "USD";
};

type CartToastPayload = {
  id: string;
  name: string;
  imageUrl: string | null;
  lineTotal: number;
  currency: "JMD" | "USD";
  itemCount: number;
};

type CartState = {
  items: CartItem[];
  cartToast: CartToastPayload | null;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  dismissToast: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      cartToast: null,
      addItem: (item) =>
        set((state) => {
          const items = [...state.items, item];
          return {
            items,
            cartToast: {
              id: item.id,
              name: item.name,
              imageUrl: item.imageUrl,
              lineTotal: item.priceAtAdd * item.length,
              currency: item.currency,
              itemCount: items.length,
            },
          };
        }),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clear: () => set({ items: [] }),
      dismissToast: () => set({ cartToast: null }),
    }),
    {
      name: "harveys-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0);
