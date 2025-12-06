import { motion } from "framer-motion";
import React from "react";

interface FinancialCardProps {
  title: string;
  amount: string;
  trend: number;
  icon: React.ReactNode;
  variant: "income" | "expense" | "balance";
}

export function FinancialCard({
  title,
  amount,
  trend,
  icon,
  variant,
}: FinancialCardProps) {
  const colorMap = {
    income: {
      bg: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
      text: "text-emerald-600",
      trend: "bg-emerald-50 text-emerald-600",
    },
    expense: {
      bg: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
      icon: "bg-red-100 text-red-600 dark:bg-red-900/30",
      text: "text-red-600",
      trend: "bg-red-50 text-red-600",
    },
    balance: {
      bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      icon: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30",
      text: "text-cyan-600",
      trend: "bg-blue-50 text-blue-600",
    },
  };

  const colors = colorMap[variant];
  const isPositive = trend > 0;

  return (
    <motion.div
      className={`bg-linear-to-br ${colors.bg}
        border border-gray-200 dark:border-gray-700 rounded-2xl p-6 
        shadow-md hover:shadow-lg hover:border-rose-300/50 
        dark:hover:border-rose-600/30 transition-all duration-300
        cursor-pointer`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-6">
        {/* Icon Circle */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}
        >
          {icon}
        </div>

        {/* Trend Badge */}
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${colors.trend}`}
        >
          <span className="text-xs font-bold">
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">
          {title}
        </p>
        <h3 className={`text-3xl font-bold ${colors.text}`}>{amount}</h3>
      </div>
    </motion.div>
  );
}

export default FinancialCard;
