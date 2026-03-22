"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  isVeg: boolean;
  qty: number;
};

type CartState = {
  shopId: string | null;
  shopName: string | null;
  items: CartItem[];
};

type CartContextType = {
  cart: CartState;
  addItem: (shopId: string, shopName: string, item: Omit<CartItem, "qty">) => void;
  changeQty: (itemId: string, qty: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({
    shopId: null,
    shopName: null,
    items: [],
  });

  const addItem = (
    shopId: string,
    shopName: string,
    item: Omit<CartItem, "qty">
  ) => {
    setCart((prev) => {
      // अगर अलग shop है तो purana cart clear करके नया शुरू कर देंगे
      if (prev.shopId && prev.shopId !== shopId) {
        return {
          shopId,
          shopName,
          items: [{ ...item, qty: 1 }],
        };
      }

      // वही shop है
      const existing = prev.items.find((i) => i.itemId === item.itemId);
      if (existing) {
        return {
          ...prev,
          shopId,
          shopName,
          items: prev.items.map((i) =>
            i.itemId === item.itemId ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }

      return {
        ...prev,
        shopId,
        shopName,
        items: [...prev.items, { ...item, qty: 1 }],
      };
    });
  };

  const changeQty = (itemId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        return {
          ...prev,
          items: prev.items.filter((i) => i.itemId !== itemId),
        };
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.itemId === itemId ? { ...i, qty } : i
        ),
      };
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.itemId !== itemId),
    }));
  };

  const clearCart = () => {
    setCart({
      shopId: null,
      shopName: null,
      items: [],
    });
  };

  const { totalItems, subTotal } = useMemo(() => {
    let tItems = 0;
    let tSub = 0;
    cart.items.forEach((i) => {
      tItems += i.qty;
      tSub += i.price * i.qty;
    });
    return { totalItems: tItems, subTotal: tSub };
  }, [cart.items]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        changeQty,
        removeItem,
        clearCart,
        totalItems,
        subTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}