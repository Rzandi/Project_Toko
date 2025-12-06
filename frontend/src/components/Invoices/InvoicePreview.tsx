import React from "react";
import { Invoice } from "../../hooks/useInvoices";

interface InvoicePreviewProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onDownloadPDF: () => Promise<void>;
  loading?: boolean;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  isOpen,
  invoice,
  onClose,
  onDownloadPDF,
  loading = false,
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pratinjau Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Invoice Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  INVOICE
                </h1>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tanggal: {formatDate(invoice.issuedDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jatuh Tempo: {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Fakturkan Ke
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {invoice.client.name}
              </p>
              {invoice.client.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {invoice.client.email}
                </p>
              )}
              {invoice.client.address && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {invoice.client.address}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Status:
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-white font-semibold text-sm ${
                  invoice.status === "draft"
                    ? "bg-gray-600"
                    : invoice.status === "sent"
                      ? "bg-blue-600"
                      : "bg-green-600"
                }`}
              >
                {invoice.status === "draft"
                  ? "Draft"
                  : invoice.status === "sent"
                    ? "Terkirim"
                    : "Dibayar"}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-900 dark:text-white font-semibold">
                    Deskripsi
                  </th>
                  <th className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold w-20">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold w-24">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-right text-gray-900 dark:text-white font-semibold w-20">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100 font-semibold">
                      {formatCurrency(
                        item.quantity * item.unitPrice * (1 + item.tax / 100),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-gray-900 dark:text-gray-100">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-gray-100">
                <span>Pajak:</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              {invoice.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Catatan
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {invoice.notes}
                  </p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Syarat & Ketentuan
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {invoice.terms}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
          >
            Tutup
          </button>
          <button
            onClick={onDownloadPDF}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Mengunduh..." : "📥 Unduh PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};
