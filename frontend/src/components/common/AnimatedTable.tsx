import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { tableRowHover } from '../../utils/animations'

type AnimatedTableRowProps = {
  children: ReactNode
  onClick?: () => void
  isClickable?: boolean
  index?: number
  className?: string
}

export default function AnimatedTableRow({
  children,
  onClick,
  isClickable = false,
  index = 0,
  className = ''
}: AnimatedTableRowProps) {
  // mark index as intentionally unused to satisfy linting
  void index;
  return (
    <motion.tr
      className={`
        border-b border-gray-200 dark:border-gray-700
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      variants={tableRowHover}
      initial="rest"
      whileHover={isClickable ? 'hover' : 'rest'}
      animate="rest"
      transition={{ duration: 0.2 }}
      layout
    >
      {children}
    </motion.tr>
  )
}

type AnimatedTableProps = {
  children: ReactNode
  className?: string
}

export function AnimatedTable({ children, className = '' }: AnimatedTableProps) {
  return (
    <motion.table
      className={`w-full text-left text-sm ${className}`}
      layout
    >
      {children}
    </motion.table>
  )
}
