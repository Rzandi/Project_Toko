import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "outline";
  hover?: boolean;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className = "", variant = "default", hover = false, onClick },
    ref,
  ) => {
    const baseClasses = "rounded-2xl transition-all duration-300 p-6";

    const variants = {
      default:
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md",
      gradient:
        "bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-fuchsia-900/20 border border-rose-200/50 dark:border-rose-700/30 shadow-sm hover:shadow-lg",
      outline:
        "bg-transparent border-2 border-slate-300 dark:border-slate-600 rounded-xl",
    };

    const hoverClass = hover ? "hover:scale-105 cursor-pointer" : "";

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${hoverClass} ${className}`}
        whileHover={hover ? { scale: 1.02 } : {}}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

interface FinancialCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string | number;
  variant?: "primary" | "secondary" | "success" | "warning";
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  trendValue,
  variant = "primary",
}) => {
  const variantClasses = {
    primary:
      "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200/50 dark:border-rose-700/30",
    secondary:
      "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200/50 dark:border-cyan-700/30",
    success:
      "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-700/30",
    warning:
      "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-700/30",
  };

  const trendColorClass = {
    up: "text-emerald-600 dark:text-emerald-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-slate-600 dark:text-slate-400",
  };

  const iconBgClass = {
    primary: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    secondary:
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    success:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    warning:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  };

  return (
    <motion.div
      className={`bg-linear-to-br ${variantClasses[variant]} border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {subtext}
            </p>
          )}
          {trend && trendValue && (
            <div
              className={`text-sm font-semibold mt-2 ${trendColorClass[trend]}`}
            >
              {trend === "up" && "↑"} {trend === "down" && "↓"} {trendValue}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass[variant]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
