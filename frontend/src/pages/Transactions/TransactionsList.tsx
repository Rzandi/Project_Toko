import React, { useState, useEffect } from "react";
import {
  useTransactions,
  Transaction,
  TransactionFilters as IFilters,
} from "../../hooks/useTransactions";
import { TransactionFilters } from "../../components/Transactions/TransactionFilters";
import { TransactionForm } from "../../components/Transactions/TransactionForm";
import { TransactionTable } from "../../components/Transactions/TransactionTable";
import { DeleteConfirmModal } from "../../components/Transactions/DeleteConfirmModal";

export const TransactionsList: React.FC = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [currentFilters, setCurrentFilters] = useState<IFilters>({
    skip: 0,
    limit: 10,
  });

  const {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  // Initial fetch
  useEffect(() => {
    fetchTransactions(currentFilters);
  }, []);

  // Handle filter changes
  const handleFiltersChange = async (filters: IFilters) => {
    setCurrentFilters({ ...filters, skip: 0 }); // Reset to page 1
    await fetchTransactions({ ...filters, skip: 0 });
    setFiltersOpen(false);
  };

  // Handle create transaction
  const handleCreateTransaction = async (data: any) => {
    try {
      await createTransaction(data);
      // Refresh list with current filters
      await fetchTransactions(currentFilters);
    } catch (err) {
      throw err;
    }
  };

  // Handle update transaction
  const handleUpdateTransaction = async (data: any) => {
    if (!editingTransaction) return;
    try {
      await updateTransaction(editingTransaction._id, data);
      // Refresh list with current filters
      await fetchTransactions(currentFilters);
      setEditingTransaction(null);
    } catch (err) {
      throw err;
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTransaction(deleteTarget._id);
      setDeleteTarget(null);
      setDeleteOpen(false);
      // Refresh list
      await fetchTransactions(currentFilters);
    } catch (err) {
      throw err;
    }
  };

  // Handle pagination
  const handleNextPage = async () => {
    const newSkip = (currentFilters.skip || 0) + (currentFilters.limit || 10);
    const newFilters = { ...currentFilters, skip: newSkip };
    setCurrentFilters(newFilters);
    await fetchTransactions(newFilters);
  };

  const handlePrevPage = async () => {
    const newSkip = Math.max(
      0,
      (currentFilters.skip || 0) - (currentFilters.limit || 10),
    );
    const newFilters = { ...currentFilters, skip: newSkip };
    setCurrentFilters(newFilters);
    await fetchTransactions(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transaksi
        </h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-200">
            Terjadi kesalahan: {error}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => {
            setEditingTransaction(null);
            setFormOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>➕</span>
          Tambah Transaksi
        </button>
        <TransactionFilters
          onFiltersChange={handleFiltersChange}
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen(!filtersOpen)}
        />
      </div>

      {/* Filters Display (when applied) */}
      {filtersOpen && (
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-200">
          Filter aktif:
          {currentFilters.startDate && ` dari ${currentFilters.startDate}`}
          {currentFilters.endDate && ` sampai ${currentFilters.endDate}`}
          {currentFilters.type && ` tipe: ${currentFilters.type}`}
          {currentFilters.category && ` kategori: ${currentFilters.category}`}
        </div>
      )}

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
        onEdit={(transaction) => {
          setEditingTransaction(transaction);
          setFormOpen(true);
        }}
        onDelete={(transaction) => {
          setDeleteTarget(transaction);
          setDeleteOpen(true);
        }}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {(currentFilters.skip || 0) + 1} -{" "}
            {Math.min(
              (currentFilters.skip || 0) + (currentFilters.limit || 10),
              pagination.total,
            )}{" "}
            dari {pagination.total} transaksi
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={(currentFilters.skip || 0) === 0}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
            >
              ← Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newSkip = i * (currentFilters.limit || 10);
                    const newFilters = { ...currentFilters, skip: newSkip };
                    setCurrentFilters(newFilters);
                    fetchTransactions(newFilters);
                  }}
                  className={`w-10 h-10 rounded-lg transition ${
                    (currentFilters.skip || 0) /
                      (currentFilters.limit || 10) ===
                    i
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={
                (currentFilters.skip || 0) + (currentFilters.limit || 10) >=
                pagination.total
              }
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={
          editingTransaction ? handleUpdateTransaction : handleCreateTransaction
        }
        initialData={editingTransaction || undefined}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        transaction={deleteTarget}
        onConfirm={handleDeleteTransaction}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        loading={loading}
      />
    </div>
  );
};

export default TransactionsList;
