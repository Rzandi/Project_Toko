import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200',
    secondary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-4 py-1.5 text-base font-semibold'
  }

  return (
    <span className={`rounded-full inline-block ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}

export const StatusBadge: React.FC<{ status: 'paid' | 'pending' | 'overdue' | 'draft' }> = ({ status }) => {
  const statusMap = {
    paid: { variant: 'success' as const, label: 'Paid' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    overdue: { variant: 'error' as const, label: 'Overdue' },
    draft: { variant: 'secondary' as const, label: 'Draft' }
  }

  return (
    <Badge variant={statusMap[status].variant} size="sm">
      {statusMap[status].label}
    </Badge>
  )
}

export default Badge
