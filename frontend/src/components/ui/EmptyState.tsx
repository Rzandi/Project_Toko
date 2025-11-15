import React from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'search' | 'error'
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'text-slate-400 dark:text-slate-500',
    search: 'text-cyan-400 dark:text-cyan-500',
    error: 'text-red-400 dark:text-red-500'
  }

  return (
    <motion.div
      className="py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <motion.div
          className={`inline-block mb-4 ${variantClasses[variant]}`}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 mx-auto">
            {icon}
          </div>
        </motion.div>
      )}

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="
            inline-block px-6 py-2.5 rounded-lg
              bg-linear-to-r from-rose-500 to-pink-500
            text-white font-medium
            hover:shadow-lg transition-all duration-200
            hover:scale-105
          "
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}

export default EmptyState
