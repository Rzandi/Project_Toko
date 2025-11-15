import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Transaction } from '../../hooks/useTransactions';

interface TransactionFormData {
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: string;
  description: string;
  paymentMethod: string;
  notes: string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Transaction;
  loading?: boolean;
}

const CATEGORIES = ['Sales', 'Services', 'Expenses', 'Other'];
const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Transfer Bank' },
  { value: 'CASH', label: 'Tunai' },
  { value: 'CARD', label: 'Kartu Kredit' },
  { value: 'CHEQUE', label: 'Cek' },
];

const validationSchema = Yup.object({
  date: Yup.string().required('Tanggal diperlukan'),
  type: Yup.string()
    .required('Tipe diperlukan')
    .oneOf(['INCOME', 'EXPENSE'], 'Tipe harus Pemasukan atau Pengeluaran'),
  category: Yup.string().required('Kategori diperlukan'),
  amount: Yup.number()
    .required('Nominal diperlukan')
    .min(1, 'Nominal harus lebih dari 0'),
  description: Yup.string()
    .required('Deskripsi diperlukan')
    .min(3, 'Deskripsi minimal 3 karakter'),
  paymentMethod: Yup.string().required('Metode pembayaran diperlukan'),
  notes: Yup.string(),
});

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    type: 'INCOME',
    category: '',
    amount: '',
    description: '',
    paymentMethod: 'BANK_TRANSFER',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        type: initialData.type,
        category: initialData.category,
        amount: String(initialData.amount),
        description: initialData.description,
        paymentMethod: initialData.paymentMethod || 'BANK_TRANSFER',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'INCOME',
        category: '',
        amount: '',
        description: '',
        paymentMethod: 'BANK_TRANSFER',
        notes: '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Validate form
      const validatedData = await validationSchema.validate(formData, {
        abortEarly: false,
      });

      // Submit
      await onSubmit({
        ...validatedData,
        amount: Number(validatedData.amount),
      });

      // Reset and close
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'INCOME',
        category: '',
        amount: '',
        description: '',
        paymentMethod: 'BANK_TRANSFER',
        notes: '',
      });
      onClose();
    } catch (err: any) {
      if (err.inner) {
        // Yup validation errors
        const errorMap: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          errorMap[e.path] = e.message;
        });
        setErrors(errorMap);
      } else {
        setSubmitError(err.message || 'Gagal menyimpan transaksi');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-200">{submitError}</p>
            </div>
          )}

          {/* Date */}
          <div>
            <label htmlFor="txn-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              id="txn-date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipe <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="INCOME"
                  checked={formData.type === 'INCOME'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Pemasukan</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="EXPENSE"
                  checked={formData.type === 'EXPENSE'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Pengeluaran</span>
              </label>
            </div>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="txn-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="txn-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="txn-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nominal <span className="text-red-500">*</span>
            </label>
            <input
              id="txn-amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="100"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="txn-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <input
              id="txn-description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Contoh: Penjualan produk A"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="txn-payment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>
            <select
              id="txn-payment"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.paymentMethod
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="txn-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catatan
            </label>
            <textarea
              id="txn-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center gap-2"
            >
              {loading && <span className="animate-spin">⟳</span>}
              {initialData ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
