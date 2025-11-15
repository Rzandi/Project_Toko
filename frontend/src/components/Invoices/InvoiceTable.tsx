import React from 'react';
import { motion } from 'framer-motion';
import { Invoice } from '../../hooks/useInvoices';
import AnimatedTableRow, { AnimatedTable } from '../common/AnimatedTable';
import { SkeletonTable } from '../common/SkeletonLoader';
import { staggerContainer } from '../../utils/animations';

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onPreview: (invoice: Invoice) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-600 dark:bg-gray-700';
    case 'sent':
      return 'bg-blue-600 dark:bg-blue-700';
    case 'paid':
      return 'bg-green-600 dark:bg-green-700';
    default:
      return 'bg-gray-600 dark:bg-gray-700';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'sent':
      return 'Terkirim';
    case 'paid':
      return 'Dibayar';
    default:
      return status;
  }
};

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  loading,
  onEdit,
  onDelete,
  onPreview,
}) => {
  if (loading && invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
        <SkeletonTable rows={5} columns={6} />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Tidak ada invoice
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Mulai dengan membuat invoice pertama Anda
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <AnimatedTable>
          {/* Header */}
          <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                No. Invoice
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Klien
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Tanggal
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Body */}
          <motion.tbody
            className="divide-y divide-gray-200 dark:divide-gray-700"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {invoices.map((invoice, idx) => (
              <AnimatedTableRow key={invoice._id} isClickable index={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                  {invoice.client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(invoice.issuedDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900 dark:text-gray-100">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusLabel(invoice.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <motion.button
                    onClick={() => onPreview(invoice)}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mr-3"
                    title="Pratinjau invoice"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    👁
                  </motion.button>
                  <motion.button
                    onClick={() => onEdit(invoice)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                    title="Edit invoice"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(invoice)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    title="Hapus invoice"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🗑
                  </motion.button>
                </td>
              </AnimatedTableRow>
            ))}
          </motion.tbody>
        </AnimatedTable>
      </div>
    </motion.div>
  );
};
