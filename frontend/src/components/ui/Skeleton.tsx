import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular" | "card";
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  variant = "text",
  count = 1,
  className = "",
}) => {
  const variantClasses = {
    text: "rounded h-5",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl",
  };

  const heightClass = {
    text: "h-5",
    circular: "w-10 h-10",
    rectangular: "h-32",
    card: "h-48",
  };

  const baseWidth = typeof width === "string" ? width : `${width}px`;
  const baseHeight = typeof height === "string" ? height : `${height}px`;

  const skeletons = Array.from({ length: count }).map((_, i) => (
    <motion.div
      key={i}
      className={`
        bg-linear-to-r from-slate-200 via-slate-100 to-slate-200
        dark:from-slate-700 dark:via-slate-600 dark:to-slate-700
        ${variantClasses[variant]}
        ${variant === "circular" ? heightClass.circular : ""}
        ${variant === "rectangular" ? heightClass.rectangular : ""}
        ${variant === "card" ? heightClass.card : ""}
        ${variant === "text" ? heightClass.text : ""}
        ${className}
      `}
      style={{
        width: variant === "circular" ? baseHeight : baseWidth,
        height: variant === "circular" ? baseHeight : baseHeight,
      }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  return count === 1 ? (
    skeletons[0]
  ) : (
    <div className="space-y-3">{skeletons}</div>
  );
};

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="space-y-3 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl"
      >
        <Skeleton width="100%" height={20} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="90%" height={14} />
      </div>
    ))}
  </div>
);

export default Skeleton;
