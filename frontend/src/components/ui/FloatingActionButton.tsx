import React from 'react'
import { motion } from 'framer-motion'

interface FloatingActionButtonProps {
  icon: React.ReactNode
  onClick: () => void
  label?: string
  color?: 'rose' | 'cyan' | 'emerald' | 'amber'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  label,
  color = 'rose',
  position = 'bottom-right'
}) => {
  const colorClasses = {
    rose: 'bg-linear-to-r from-rose-500 to-pink-500 hover:shadow-rose-500/50',
    cyan: 'bg-linear-to-r from-cyan-500 to-blue-500 hover:shadow-cyan-500/50',
    emerald: 'bg-linear-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/50',
    amber: 'bg-linear-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/50'
  }

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} z-40
        w-14 h-14 rounded-full
        ${colorClasses[color]}
        text-white shadow-lg
        flex items-center justify-center
        transition-all duration-300
        hover:shadow-2xl
        group
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>

      {label && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: -60 }}
          className="absolute right-full mr-3 bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  )
}

export default FloatingActionButton
