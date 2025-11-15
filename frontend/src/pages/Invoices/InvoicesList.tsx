import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  InvoiceTable,
  InvoiceForm,
  InvoicePreview,
  InvoiceFilters,
} from '../../components/Invoices';
import { useInvoices, Invoice, InvoiceFilters as IFilters } from '../../hooks/useInvoices';
import { toastService } from '../../services/toastService';
import AnimatedButton from '../../components/common/AnimatedButton';
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations';

export default function InvoicesList() {
  const {
    invoices,
    loading,
    error,
    pagination,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getNextInvoiceNumber,
  } = useInvoices();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<IFilters>({
    skip: 0,
    limit: 10,
  });
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('INV-001');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load invoices on component mount
  useEffect(() => {
    fetchInvoices(currentFilters);
    loadNextInvoiceNumber();
  }, []);

  const loadNextInvoiceNumber = async () => {
    const number = await getNextInvoiceNumber();
    setNextInvoiceNumber(number);
  };

  const handleOpenCreateForm = async () => {
    setEditingInvoice(null);
    setFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormOpen(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setDeleteTarget(invoice);
    setDeleteConfirmOpen(true);
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const loadingToastId = toastService.loading('Menghapus invoice...');
      await deleteInvoice(deleteTarget._id);
      toastService.updateLoading(loadingToastId, 'Invoice berhasil dihapus!', 'success');
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      // Refetch with current filters
      await fetchInvoices(currentFilters);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal menghapus invoice';
      toastService.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateInvoice = async (
    data: Omit<Invoice, '_id' | 'user' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const loadingToastId = toastService.loading('Membuat invoice...');
      await createInvoice(data);
      toastService.updateLoading(loadingToastId, 'Invoice berhasil dibuat!', 'success');
      setFormOpen(false);
      setEditingInvoice(null);
      loadNextInvoiceNumber();
      // Refetch with current filters
      await fetchInvoices(currentFilters);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal membuat invoice';
      toastService.error(errorMessage);
      throw err;
    }
  };

  const handleUpdateInvoice = async (
    data: Omit<Invoice, '_id' | 'user' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingInvoice) return;
    try {
      const loadingToastId = toastService.loading('Memperbarui invoice...');
      await updateInvoice(editingInvoice._id, data);
      toastService.updateLoading(loadingToastId, 'Invoice berhasil diperbarui!', 'success');
      setFormOpen(false);
      setEditingInvoice(null);
      // Refetch with current filters
      await fetchInvoices(currentFilters);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Gagal memperbarui invoice';
      toastService.error(errorMessage);
      throw err;
    }
  };

  const handleFiltersChange = async (filters: IFilters) => {
    const newFilters = { ...filters, skip: 0 };
    setCurrentFilters(newFilters);
    await fetchInvoices(newFilters);
    setFiltersOpen(false);
  };

  const handleNextPage = async () => {
    const newFilters = {
      ...currentFilters,
      skip: (currentFilters.skip || 0) + (currentFilters.limit || 10),
    };
    setCurrentFilters(newFilters);
    await fetchInvoices(newFilters);
  };

  const handlePrevPage = async () => {
    const newFilters = {
      ...currentFilters,
      skip: Math.max(0, (currentFilters.skip || 0) - (currentFilters.limit || 10)),
    };
    setCurrentFilters(newFilters);
    await fetchInvoices(newFilters);
  };

  const handlePageClick = async (page: number) => {
    const newFilters = {
      ...currentFilters,
      skip: (page - 1) * (currentFilters.limit || 10),
    };
    setCurrentFilters(newFilters);
    await fetchInvoices(newFilters);
  };

  const currentPage = Math.floor((currentFilters.skip || 0) / (currentFilters.limit || 10)) + 1;

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div className="flex justify-between items-center" variants={staggerItem}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice</h1>
        <AnimatedButton
          onClick={handleOpenCreateForm}
          variant="primary"
          size="md"
        >
          + Buat Invoice
        </AnimatedButton>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="text-red-700 dark:text-red-200">⚠️ {error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div variants={staggerItem}>
        <InvoiceFilters
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen(!filtersOpen)}
          onFiltersChange={handleFiltersChange}
        />
      </motion.div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {(currentFilters.status ||
          currentFilters.startDate ||
          currentFilters.endDate) && (
          <motion.div
            className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Menampilkan hasil dengan filter:{' '}
              {currentFilters.status && `Status: ${currentFilters.status}`}
              {currentFilters.startDate && ` | Dari: ${currentFilters.startDate}`}
              {currentFilters.endDate && ` | Sampai: ${currentFilters.endDate}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Table */}
      <motion.div variants={staggerItem}>
        <InvoiceTable
          invoices={invoices}
          loading={loading}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onPreview={handlePreviewInvoice}
        />
      </motion.div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          className="flex justify-center items-center gap-2"
          variants={staggerItem}
        >
          <AnimatedButton
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            variant="secondary"
            size="sm"
          >
            ← Sebelumnya
          </AnimatedButton>

          <div className="flex gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => handlePageClick(page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>

          <AnimatedButton
            onClick={handleNextPage}
            disabled={currentPage === pagination.pages}
            variant="secondary"
            size="sm"
          >
            Selanjutnya →
          </AnimatedButton>
        </motion.div>
      )}

      {/* Invoice Form Modal */}
      <InvoiceForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingInvoice(null);
        }}
        onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
        initialData={editingInvoice || undefined}
        nextInvoiceNumber={nextInvoiceNumber}
        loading={loading}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreview
        isOpen={previewOpen}
        invoice={previewInvoice}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewInvoice(null);
        }}
        onDownloadPDF={async () => {
          // To be implemented in Phase 5.5
          alert('PDF download coming soon!');
        }}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Hapus Invoice?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Invoice <strong>{deleteTarget.invoiceNumber}</strong> akan dihapus secara
                permanen. Aksi ini tidak dapat dibatalkan.
              </p>

              <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg mb-6">
                <p className="text-sm text-red-700 dark:text-red-200">
                  <strong>Detail:</strong> {deleteTarget.client.name} -{' '}
                  {deleteTarget.totalAmount.toLocaleString('id-ID')} IDR
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setDeleteTarget(null);
                  }}
                  disabled={deleteLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  Batal
                </motion.button>
                <AnimatedButton
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  loading={deleteLoading}
                  variant="danger"
                >
                  Hapus Invoice
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
