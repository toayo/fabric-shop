import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartUnit = "yard" | "meter" | "spool";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string | null;
  color: string | null;
  unit: CartUnit;
  length: number;
  priceAtAdd: number;
  currency: "JMD" | "USD";
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
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
    }),
    {
      name: "harveys-cart",
    }
  )
);

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.priceAtAdd * item.length, 0);
