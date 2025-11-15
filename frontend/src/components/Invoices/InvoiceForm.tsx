import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Invoice, LineItem, InvoiceClient } from '../../hooks/useInvoices';
import { InvoiceLineItems } from './InvoiceLineItems';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Invoice, '_id' | 'user' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Invoice;
  loading?: boolean;
  nextInvoiceNumber?: string;
}

const invoiceSchema = yup.object().shape({
  client: yup.object().shape({
    id: yup.string().required('Client ID required'),
    name: yup.string().required('Client name required'),
    email: yup.string().email('Valid email required'),
    address: yup.string(),
  }).required('Client required'),
  items: yup.array()
    .of(
      yup.object().shape({
        description: yup.string().required('Description required').min(3),
        quantity: yup.number().positive().required('Quantity required'),
        unitPrice: yup.number().positive().required('Unit price required'),
        tax: yup.number().min(0).max(100),
      })
    )
    .min(1, 'At least one item required'),
  issuedDate: yup.string().required('Issued date required'),
  dueDate: yup.string().required('Due date required'),
  status: yup.string().oneOf(['draft', 'sent', 'paid']),
  notes: yup.string(),
  terms: yup.string(),
});

// Mock clients - in production, fetch from API
const MOCK_CLIENTS: InvoiceClient[] = [
  { id: '1', name: 'PT Contoh Perusahaan', email: 'contact@contoh.com', address: 'Jln. Contoh, Jakarta' },
  { id: '2', name: 'CV Bisnis Maju', email: 'info@bisnismaju.com', address: 'Jln. Maju, Bandung' },
  { id: '3', name: 'UD Toko Kami', email: 'toko@example.com', address: 'Jln. Ramai, Surabaya' },
];

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  nextInvoiceNumber = 'INV-001',
}) => {
  const [formData, setFormData] = useState<Omit<Invoice, '_id' | 'user' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>>({
    client: { id: '', name: '', email: '', address: '' },
    items: [],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    status: 'draft',
    currency: 'IDR',
    issuedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        client: initialData.client,
        items: initialData.items,
        subtotal: initialData.subtotal,
        taxAmount: initialData.taxAmount,
        totalAmount: initialData.totalAmount,
        status: initialData.status,
        currency: initialData.currency,
        issuedDate: initialData.issuedDate,
        dueDate: initialData.dueDate,
        notes: initialData.notes,
        terms: initialData.terms,
      });
    } else {
      setFormData({
        client: { id: '', name: '', email: '', address: '' },
        items: [],
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0,
        status: 'draft',
        currency: 'IDR',
        issuedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedClient = MOCK_CLIENTS.find((c) => c.id === selectedId);
    if (selectedClient) {
      setFormData({ ...formData, client: selectedClient });
      setErrors({ ...errors, 'client.id': '' });
    }
  };

  const handleDateChange = (field: 'issuedDate' | 'dueDate', value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleStatusChange = (value: 'draft' | 'sent' | 'paid') => {
    setFormData({ ...formData, status: value });
  };

  const handleItemsChange = (items: LineItem[]) => {
    setFormData({ ...formData, items });
  };

  const handleTotalChange = (subtotal: number, taxAmount: number, total: number) => {
    setFormData({ ...formData, subtotal, taxAmount, totalAmount: total });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, terms: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await invoiceSchema.validate(formData);
      setErrors({});
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      if (err.inner) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error: any) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ submit: err.message });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Invoice' : 'Buat Invoice Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Number Display */}
          {!initialData && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No. Invoice: <span className="font-bold text-blue-600 dark:text-blue-400">{nextInvoiceNumber}</span>
              </p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg">
              <p className="text-red-700 dark:text-red-200">{errors.submit}</p>
            </div>
          )}

          {/* Client Selection */}
          <div>
            <label htmlFor="invoice-client" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Klien *
            </label>
            <select
              id="invoice-client"
              name="clientId"
              value={formData.client.id || ''}
              onChange={handleClientChange}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${
                errors['client.id'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Pilih Klien</option>
              {MOCK_CLIENTS.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors['client.id'] && (
              <p className="text-red-500 text-sm mt-1">{errors['client.id']}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="invoice-issuedDate" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tanggal Terbit *
              </label>
              <input
                id="invoice-issuedDate"
                name="issuedDate"
                type="date"
                value={formData.issuedDate}
                onChange={(e) => handleDateChange('issuedDate', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issuedDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.issuedDate && (
                <p className="text-red-500 text-sm mt-1">{errors.issuedDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="invoice-dueDate" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Jatuh Tempo *
              </label>
              <input
                id="invoice-dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleDateChange('dueDate', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <InvoiceLineItems
              items={formData.items}
              onItemsChange={handleItemsChange}
              onTotalChange={handleTotalChange}
            />
            {errors.items && (
              <p className="text-red-500 text-sm mt-2">{errors.items}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Status
            </label>
            <div className="flex gap-4">
              {(['draft', 'sent', 'paid'] as const).map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={() => handleStatusChange(status)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {status === 'draft' ? 'Draft' : status === 'sent' ? 'Terkirim' : 'Dibayar'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="invoice-notes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Catatan
            </label>
            <textarea
              id="invoice-notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleNotesChange}
              placeholder="Catatan tambahan untuk invoice ini"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Terms */}
          <div>
            <label htmlFor="invoice-terms" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Syarat & Ketentuan
            </label>
            <textarea
              id="invoice-terms"
              name="terms"
              value={formData.terms || ''}
              onChange={handleTermsChange}
              placeholder="Syarat pembayaran dan ketentuan lainnya"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Totals Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formData.subtotal.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pajak</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formData.taxAmount.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formData.totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : initialData ? 'Perbarui' : 'Buat Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};
