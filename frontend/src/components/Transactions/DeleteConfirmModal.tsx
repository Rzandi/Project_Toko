import React from 'react';
import { Transaction } from '../../hooks/useTransactions';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  transaction,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Hapus Transaksi?
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Anda akan menghapus transaksi berikut:
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString('id-ID')}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  transaction.type === 'INCOME'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {transaction.type === 'INCOME' ? '+' : '-'}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(transaction.amount)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Kategori: {transaction.category}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-red-400 flex items-center justify-center gap-2"
          >
            {loading && <span className="animate-spin">⟳</span>}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
