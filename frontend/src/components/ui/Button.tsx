import { motion } from "framer-motion";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base h-11",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-linear-to-r from-indigo-600 to-cyan-500 hover:shadow-lg " +
      "hover:scale-105 text-white focus:ring-indigo-500",
    secondary:
      "bg-linear-to-r from-rose-500 to-fuchsia-500 hover:shadow-lg " +
      "hover:scale-105 text-white focus:ring-rose-500",
    ghost:
      "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 " +
      "dark:hover:bg-indigo-900/20 focus:ring-indigo-500",
    danger:
      "bg-linear-to-r from-red-500 to-orange-500 hover:shadow-lg " +
      "hover:scale-105 text-white focus:ring-red-500",
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      {...(rest as any)}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          ⟳
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
}

export default Button;
