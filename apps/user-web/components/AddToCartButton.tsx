"use client";

import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

interface AddToCartButtonProps {
  item: { _id: string; name: string; price: number };
  disabled?: boolean;
}

export default function AddToCartButton({ item, disabled }: AddToCartButtonProps) {
  const { showToast } = useToast();

  const handleAddToCart = () => {
    showToast(`Added ${item.name} to cart`, "success");
    
    // Dispatch a custom event to trigger Cart counter bump in Navbar
    window.dispatchEvent(new CustomEvent('bumpCartIcon'));
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={handleAddToCart}
      disabled={disabled}
      className={`rounded-full px-5 py-2 text-sm font-medium transition shadow-lg ${
        disabled 
          ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none" 
          : "bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-brand-500/30 active:opacity-80"
      }`}
    >
      Add to Cart
    </motion.button>
  );
}
