import React from "react";
import { motion } from "framer-motion";
import { Badge, StatusBadge } from "./Badge";
import { MoreVertical } from "lucide-react";

interface TransactionRowProps {
  id: string;
  description: string;
  category?: string;
  amount: number;
  date: string;
  status?: "completed" | "pending" | "failed";
  type?: "income" | "expense";
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  id,
  description,
  category,
  amount,
  date,
  status = "completed",
  type = "expense",
  onView,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const amountColor =
    type === "income"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  const amountSign = type === "income" ? "+" : "-";

  return (
    <motion.tr
      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {description}
          </p>
          {category && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {category}
            </p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className={`font-semibold ${amountColor}`}>
          {amountSign} Rp{amount.toLocaleString("id-ID")}
        </p>
      </td>
      <td className="px-6 py-4">
        {status && <StatusBadge status={status as any} />}
      </td>
      <td className="px-6 py-4 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <MoreVertical
            size={18}
            className="text-slate-400 dark:text-slate-500"
          />
        </button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-8 top-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10"
          >
            {onView && (
              <button
                onClick={() => {
                  onView();
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-lg"
              >
                View
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg"
              >
                Delete
              </button>
            )}
          </motion.div>
        )}
      </td>
    </motion.tr>
  );
};

export default TransactionRow;
