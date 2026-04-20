"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ loading, variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] border-none px-4 py-2",
    secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10 px-4 py-2",
    danger: "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/20 px-4 py-2",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-2"
  };

  return (
    <motion.button
      whileTap={{ scale: props.disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
