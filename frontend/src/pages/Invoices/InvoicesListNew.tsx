import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  FileText,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, FinancialCard } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { FloatingActionButton } from "../../components/ui/FloatingActionButton";
import toast from "react-hot-toast";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: "draft" | "sent" | "paid" | "overdue";
  notes?: string;
  totalAmount?: number;
}

interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: "draft" | "sent" | "paid" | "overdue";
  notes: string;
}

const INVOICE_STATUSES = [
  { value: "draft", label: "📝 Draft" },
  { value: "sent", label: "📧 Sent" },
  { value: "paid", label: "✓ Paid" },
  { value: "overdue", label: "⚠️ Overdue" },
];

export default function InvoicesList() {
  // Invoices will be loaded from API or created by user - empty for live demo
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formStep, setFormStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [{ id: "1", description: "", quantity: 1, price: 0 }],
    status: "draft",
    notes: "",
  });

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchSearch =
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === "all" || invoice.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
    const paid = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.totalAmount || 0), 0);
    const pending = invoices
      .filter((i) => i.status === "sent")
      .reduce((sum, i) => sum + (i.totalAmount || 0), 0);
    return { total, paid, pending, count: invoices.length };
  }, [invoices]);

  const handleOpenForm = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientPhone: invoice.clientPhone,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        items: invoice.items,
        status: invoice.status as "draft" | "sent" | "paid" | "overdue",
        notes: invoice.notes || "",
      });
    } else {
      setEditingInvoice(null);
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        items: [{ id: "1", description: "", quantity: 1, price: 0 }],
        status: "draft",
        notes: "",
      });
    }
    setFormStep(1);
    setIsFormOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { id: Date.now().toString(), description: "", quantity: 1, price: 0 },
      ],
    });
  };

  const handleRemoveItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id),
      });
    }
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const handleSaveInvoice = () => {
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Harap isi nama dan email klien");
      return;
    }

    if (formData.items.some((item) => !item.description || item.price === 0)) {
      toast.error("Harap isi semua item invoice");
      return;
    }

    const totalAmount = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    if (editingInvoice) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingInvoice.id
            ? { ...inv, ...formData, totalAmount }
            : inv,
        ),
      );
      toast.success("Invoice berhasil diperbarui");
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
        ...formData,
        totalAmount,
      };
      setInvoices([newInvoice, ...invoices]);
      toast.success("Invoice berhasil dibuat");
    }

    setIsFormOpen(false);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
    toast.success("Invoice berhasil dihapus");
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const calculateItemTotal = (item: InvoiceItem) => item.quantity * item.price;
  const invoiceTotalAmount = formData.items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Invoices
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Kelola invoice dan pembayaran klien
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          label="Total Invoice"
          value={stats.count}
          subtext={`Rp ${(stats.total / 1000000).toFixed(1)}M total`}
          variant="primary"
          icon={<FileText size={20} />}
        />
        <FinancialCard
          label="Sudah Dibayar"
          value={`Rp ${(stats.paid / 1000000).toFixed(1)}M`}
          trend="up"
          trendValue={`${invoices.filter((i) => i.status === "paid").length} invoice`}
          variant="success"
          icon={<DollarSign size={20} />}
        />
        <FinancialCard
          label="Pending"
          value={`Rp ${(stats.pending / 1000000).toFixed(1)}M`}
          variant="warning"
          icon={<CalendarDays size={20} />}
        />
        <FinancialCard
          label="Overdue"
          value={invoices.filter((i) => i.status === "overdue").length}
          subtext={`Rp ${invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + (i.totalAmount || 0), 0) / 1000000}M`}
          variant="primary"
          icon={<FileText size={20} />}
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Cari nomor invoice, klien, atau email..."
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "all", label: "Semua Status" },
              ...INVOICE_STATUSES,
            ]}
          />
          <Button onClick={() => handleOpenForm()} className="md:w-auto">
            <Plus size={18} className="mr-2" />
            Buat Invoice
          </Button>
        </div>
      </Card>

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Klien
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Jatuh Tempo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {invoice.clientName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {invoice.clientEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Rp{(invoice.totalAmount || 0).toLocaleString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(invoice.dueDate).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "success"
                              : invoice.status === "overdue"
                                ? "error"
                                : invoice.status === "sent"
                                  ? "warning"
                                  : "secondary"
                          }
                          size="sm"
                        >
                          {
                            INVOICE_STATUSES.find(
                              (s) => s.value === invoice.status,
                            )?.label
                          }
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenForm(invoice)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <EmptyState
            icon={<FileText size={48} />}
            title="Tidak ada invoice"
            description={
              searchQuery
                ? "Tidak ditemukan invoice sesuai pencarian"
                : "Mulai dengan membuat invoice pertama"
            }
            action={{
              label: "Buat Invoice",
              onClick: () => handleOpenForm(),
            }}
          />
        </Card>
      )}

      {/* Invoice Form Modal - 4 Steps */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingInvoice ? "Edit Invoice" : "Buat Invoice Baru"}
        size="lg"
        footer={
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {formStep > 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setFormStep(formStep - 1)}
                >
                  Kembali
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsFormOpen(false)}>
                Batal
              </Button>
              {formStep < 4 ? (
                <Button onClick={() => setFormStep(formStep + 1)}>
                  Lanjut
                </Button>
              ) : (
                <Button onClick={handleSaveInvoice}>
                  {editingInvoice ? "Perbarui" : "Buat"} Invoice
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Step 1: Client Info */}
        {formStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Step 1 of 4: Informasi Klien
              </p>
            </div>
            <Input
              label="Nama Klien"
              placeholder="PT Maju Jaya"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
            />
            <Input
              label="Email Klien"
              type="email"
              placeholder="info@majujaya.com"
              value={formData.clientEmail}
              onChange={(e) =>
                setFormData({ ...formData, clientEmail: e.target.value })
              }
            />
            <Input
              label="Telepon Klien"
              placeholder="+62 812 3456 7890"
              value={formData.clientPhone}
              onChange={(e) =>
                setFormData({ ...formData, clientPhone: e.target.value })
              }
            />
          </motion.div>
        )}

        {/* Step 2: Dates */}
        {formStep === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Step 2 of 4: Tanggal Invoice
              </p>
            </div>
            <Input
              label="Tanggal Invoice"
              type="date"
              value={formData.issueDate}
              onChange={(e) =>
                setFormData({ ...formData, issueDate: e.target.value })
              }
            />
            <Input
              label="Tanggal Jatuh Tempo"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </motion.div>
        )}

        {/* Step 3: Items */}
        {formStep === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 max-h-96 overflow-y-auto"
          >
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4 sticky top-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Step 3 of 4: Item Invoice
              </p>
            </div>
            {formData.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Item {index + 1}
                  </p>
                  {formData.items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <Input
                  label="Deskripsi"
                  placeholder="Contoh: Service A"
                  value={item.description}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "description", e.target.value)
                  }
                />
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Qty"
                    type="number"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                  <Input
                    label="Harga"
                    type="number"
                    placeholder="0"
                    value={item.price}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        "price",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                  <div className="pt-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Rp{calculateItemTotal(item).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <Button variant="secondary" fullWidth onClick={handleAddItem}>
              <Plus size={18} className="mr-2" />
              Tambah Item
            </Button>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {formStep === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Step 4 of 4: Review & Finalisasi
              </p>
            </div>

            <div className="space-y-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Klien
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formData.clientName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formData.clientEmail}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tgl Invoice
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(formData.issueDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Jatuh Tempo
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(formData.dueDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {item.description} x{item.quantity}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Rp{calculateItemTotal(item).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-linear-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200/50 dark:border-rose-700/30 rounded-lg">
              <p className="text-sm text-rose-700 dark:text-rose-300 mb-1">
                Total Invoice
              </p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                Rp{invoiceTotalAmount.toLocaleString("id-ID")}
              </p>
            </div>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "draft"
                    | "sent"
                    | "paid"
                    | "overdue",
                })
              }
              options={INVOICE_STATUSES}
            />

            <Input
              label="Catatan (Opsional)"
              placeholder="Catatan tambahan untuk invoice ini"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </motion.div>
        )}
      </Modal>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedInvoice(null);
          }}
          title={selectedInvoice.invoiceNumber}
          size="lg"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDetailOpen(false)}
              >
                Tutup
              </Button>
              <Button onClick={() => toast.success("Invoice berhasil diunduh")}>
                <Download size={18} className="mr-2" />
                Download PDF
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Kepada
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedInvoice.clientName}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedInvoice.clientEmail}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedInvoice.clientPhone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Status
                </p>
                <Badge
                  variant={
                    selectedInvoice.status === "paid"
                      ? "success"
                      : selectedInvoice.status === "overdue"
                        ? "error"
                        : "warning"
                  }
                >
                  {
                    INVOICE_STATUSES.find(
                      (s) => s.value === selectedInvoice.status,
                    )?.label
                  }
                </Badge>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Tanggal Invoice
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date(selectedInvoice.issueDate).toLocaleDateString(
                    "id-ID",
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Jatuh Tempo
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date(selectedInvoice.dueDate).toLocaleDateString(
                    "id-ID",
                  )}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-3">
                Item Invoice
              </p>
              <div className="space-y-2">
                {selectedInvoice.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {item.quantity}x @ Rp
                        {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Rp{(item.quantity * item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-4 bg-linear-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200/50 dark:border-rose-700/30 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Total
                </p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  Rp{(selectedInvoice.totalAmount || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Notes */}
            {selectedInvoice.notes && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Catatan
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedInvoice.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* FAB */}
      <FloatingActionButton
        icon={<Plus size={24} />}
        onClick={() => handleOpenForm()}
        label="Buat Invoice"
        color="cyan"
      />
    </div>
  );
}
