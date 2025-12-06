import React from "react";
import { motion } from "framer-motion";

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="h-24 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg"
          animate={{ backgroundPosition: "200% center" }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ backgroundSize: "200% center" }}
        />
      ))}
    </div>
  );
}

export default SkeletonLoader;
