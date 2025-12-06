// 🎨 InvoiceEase Component Examples
// Modern Colorful Startup Style - React + Tailwind + Framer Motion

// ============================================================================
// 1. FINANCIAL CARD COMPONENT
// ============================================================================

import { motion } from "framer-motion";
import React from "react";

interface FinancialCardProps {
  title: string;
  amount: string;
  trend: number; // positive or negative
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

// Usage:
/*
<FinancialCard
  title="Total Income"
  amount="Rp 12.500.000"
  trend={12}
  icon={<TrendingUpIcon />}
  variant="income"
/>
*/

// ============================================================================
// 2. ANIMATED BUTTON COMPONENTS
// ============================================================================

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
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
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      onClick={onClick}
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

// Usage:
/*
<Button variant="primary" size="lg">
  + Buat Transaksi Baru
</Button>

<Button variant="secondary" isLoading={loading}>
  {loading ? 'Loading...' : 'Simpan Invoice'}
</Button>
*/

// ============================================================================
// 3. FLOATING ACTION BUTTON
// ============================================================================

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function FloatingActionButton({
  icon,
  label,
  onClick,
  variant = "primary",
}: FloatingActionButtonProps) {
  const gradients = {
    primary: "from-rose-500 to-fuchsia-500",
    secondary: "from-indigo-500 to-cyan-500",
  };

  return (
    <motion.button
      className={`fixed bottom-8 right-8 md:bottom-10 md:right-10 
        w-14 h-14 rounded-full bg-linear-to-br ${gradients[variant]} 
        shadow-2xl text-white flex items-center justify-center text-2xl
        hover:shadow-3xl dark:shadow-rose-500/30 z-40`}
      animate={{ y: 0, scale: 1 }}
      initial={{ y: 20, scale: 0.8 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={onClick}
      title={label}
    >
      {icon}
    </motion.button>
  );
}

// Usage:
/*
<FloatingActionButton
  icon="+"
  label="Tambah Transaksi"
  onClick={() => setShowModal(true)}
/>
*/

// ============================================================================
// 4. FORM INPUT WITH FLOATING LABEL
// ============================================================================

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
}: FormInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const isFloating = isFocused || value;

  return (
    <motion.div className="relative mb-6">
      <motion.label
        htmlFor={id}
        className={`absolute left-4 font-semibold transition-all duration-200 ${
          isFloating
            ? "top-0 text-xs text-indigo-600 dark:text-indigo-400 -translate-y-3 bg-white dark:bg-gray-800 px-1"
            : "top-3.5 text-sm text-gray-600 dark:text-gray-400"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFloating ? "" : placeholder}
        className={`w-full px-4 py-3 pt-6 border rounded-xl 
          transition-all duration-200 bg-white dark:bg-gray-700
          text-gray-900 dark:text-white placeholder-gray-400
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          }`}
        required={required}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"
        >
          ⚠️ {error}
        </motion.p>
      )}
    </motion.div>
  );
}

// Usage:
/*
<FormInput
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>
*/

// ============================================================================
// 5. MODAL DIALOG
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal Card */}
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
          max-h-[90vh] overflow-y-auto w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            whileHover={{ scale: 1.1 }}
          >
            ✕
          </motion.button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// 6. EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon: string; // emoji
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Illustration */}
      <motion.div
        className="text-6xl mb-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
        {description}
      </p>

      {/* Action Button */}
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    </motion.div>
  );
}

// Usage:
/*
<EmptyState
  icon="💳"
  title="Transaksi masih kosong"
  description="Yuk catat setiap transaksi biar keuangan lo terorganisir 💪"
  actionLabel="+ Tambah Transaksi"
  onAction={() => setShowModal(true)}
/>
*/

// ============================================================================
// 7. TRANSACTION TABLE ROW
// ============================================================================

interface TransactionRowProps {
  date: string;
  description: string;
  amount: string;
  status: "paid" | "pending" | "overdue" | "draft";
  onEdit: () => void;
  onDelete: () => void;
  onDownload?: () => void;
}

export function TransactionRow({
  date,
  description,
  amount,
  status,
  onEdit,
  onDelete,
  onDownload,
}: TransactionRowProps) {
  const statusStyles = {
    paid: "bg-green-50 text-green-700 dark:bg-green-900/30",
    pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30",
    overdue: "bg-red-50 text-red-700 dark:bg-red-900/30",
    draft: "bg-gray-50 text-gray-700 dark:bg-gray-900/30",
  };

  const statusLabels = {
    paid: "✓ Paid",
    pending: "⏳ Pending",
    overdue: "⚠ Overdue",
    draft: "📝 Draft",
  };

  return (
    <motion.tr
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
    >
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
        {date}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
        {description}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {amount}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          {onDownload && (
            <motion.button
              onClick={onDownload}
              className="text-rose-600 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
              whileHover={{ scale: 1.2 }}
            >
              ⬇️
            </motion.button>
          )}
          <motion.button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
            whileHover={{ scale: 1.2 }}
          >
            ✏️
          </motion.button>
          <motion.button
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            whileHover={{ scale: 1.2 }}
          >
            🗑️
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

// ============================================================================
// 8. SIDEBAR NAVIGATION ITEM
// ============================================================================

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

export function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
  isCollapsed,
}: SidebarItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg 
        transition-all duration-200 relative
        ${
          isActive
            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-r-full"
          layoutId="sidebar-indicator"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <span className="text-xl">{icon}</span>

      <motion.span
        className={`font-medium transition-all duration-200 ${
          isCollapsed ? "opacity-0 w-0" : "opacity-100"
        }`}
      >
        {label}
      </motion.span>

      {isActive && !isCollapsed && (
        <motion.div
          className="ml-auto w-2 h-2 rounded-full bg-rose-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.button>
  );
}

// ============================================================================
// 9. STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const colors = {
    success:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    warning:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    error:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  };

  return (
    <motion.span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colors[status]}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {children}
    </motion.span>
  );
}

// ============================================================================
// 10. LOADING SKELETON
// ============================================================================

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

export default {
  FinancialCard,
  Button,
  FloatingActionButton,
  FormInput,
  Modal,
  EmptyState,
  TransactionRow,
  SidebarItem,
  StatusBadge,
  SkeletonLoader,
};
