import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Filter,
  Search,
  Download,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { FloatingActionButton } from "../components/ui/FloatingActionButton";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
  notes?: string;
}

interface TransactionFormData {
  date: string;
  description: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
  notes: string;
}

export default function TransactionsList() {
  // Transactions will be loaded from API or added by user - empty for live demo
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    amount: "",
    type: "expense",
    status: "completed",
    paymentMethod: "",
    notes: "",
  });

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "all" || t.type === filterType;
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      const matchCategory =
        filterCategory === "all" || t.category === filterCategory;

      return matchSearch && matchType && matchStatus && matchCategory;
    });
  }, [transactions, searchQuery, filterType, filterStatus, filterCategory]);

  // Calculate stats
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount.toString(),
        type: transaction.type as "income" | "expense",
        status: transaction.status as "completed" | "pending" | "failed",
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes || "",
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "",
        amount: "",
        type: "expense",
        status: "completed",
        paymentMethod: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTransaction = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Harap isi semua field yang diperlukan");
      return;
    }

    if (editingTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id
            ? {
                ...t,
                ...formData,
                amount: parseFloat(formData.amount),
              }
            : t,
        ),
      );
      toast.success("Transaksi berhasil diperbarui");
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
      };
      setTransactions([newTransaction, ...transactions]);
      toast.success("Transaksi berhasil ditambahkan");
    }

    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Transaksi berhasil dihapus");
  };

  const categories = [
    "Sales",
    "Supplies",
    "Utilities",
    "Salary",
    "Marketing",
    "Other",
  ];
  const paymentMethods = [
    "Bank Transfer",
    "Credit Card",
    "Cash",
    "Auto Debit",
    "E-Wallet",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Transaksi
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Kelola semua transaksi bisnis Anda
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-700/30">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Total Pendapatan
          </p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            Rp{(stats.income / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-2">
            {transactions.filter((t) => t.type === "income").length} transaksi
          </p>
        </Card>

        <Card className="bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/50 dark:border-red-700/30">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Total Pengeluaran
          </p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            Rp{(stats.expense / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-red-600 dark:text-red-300 mt-2">
            {transactions.filter((t) => t.type === "expense").length} transaksi
          </p>
        </Card>

        <Card className="bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200/50 dark:border-cyan-700/30">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Laba Bersih
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${stats.net >= 0 ? "text-cyan-600 dark:text-cyan-400" : "text-red-600 dark:text-red-400"}`}
          >
            Rp{(stats.net / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-cyan-600 dark:text-cyan-300 mt-2">
            {((stats.net / stats.income) * 100).toFixed(0)}% margin
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Cari deskripsi atau kategori..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => handleOpenModal()} className="md:w-auto">
              <Plus size={18} className="mr-2" />
              Tambah Transaksi
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: "all", label: "Semua Tipe" },
                { value: "income", label: "📈 Pendapatan" },
                { value: "expense", label: "📉 Pengeluaran" },
              ]}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "all", label: "Semua Status" },
                { value: "completed", label: "✓ Selesai" },
                { value: "pending", label: "⏳ Pending" },
                { value: "failed", label: "✗ Gagal" },
              ]}
            />
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={[
                { value: "all", label: "Semua Kategori" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
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
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Jumlah
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
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {transaction.type === "income" ? (
                              <TrendingUp
                                className="inline mr-2 text-emerald-500"
                                size={16}
                              />
                            ) : (
                              <TrendingDown
                                className="inline mr-2 text-red-500"
                                size={16}
                              />
                            )}
                            {transaction.description}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {transaction.category} • {transaction.paymentMethod}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"} Rp
                          {transaction.amount.toLocaleString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "success"
                              : transaction.status === "pending"
                                ? "warning"
                                : "error"
                          }
                          size="sm"
                        >
                          {transaction.status === "completed"
                            ? "Selesai"
                            : transaction.status === "pending"
                              ? "Pending"
                              : "Gagal"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(transaction)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
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
            icon={<Filter size={48} />}
            title="Tidak ada transaksi"
            description={
              searchQuery
                ? "Tidak ditemukan transaksi sesuai pencarian"
                : "Mulai dengan menambahkan transaksi pertama"
            }
            action={{
              label: "Tambah Transaksi",
              onClick: () => handleOpenModal(),
            }}
          />
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveTransaction}>
              {editingTransaction ? "Perbarui" : "Tambah"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tanggal"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <Select
              label="Tipe"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "income" | "expense",
                })
              }
              options={[
                { value: "income", label: "📈 Pendapatan" },
                { value: "expense", label: "📉 Pengeluaran" },
              ]}
            />
          </div>

          <Input
            label="Deskripsi"
            placeholder="Contoh: Invoice INV-001 Payment"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              options={categories.map((c) => ({ value: c, label: c }))}
            />
            <Input
              label="Jumlah"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Metode Pembayaran"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              options={paymentMethods.map((m) => ({ value: m, label: m }))}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "completed" | "pending" | "failed",
                })
              }
              options={[
                { value: "completed", label: "✓ Selesai" },
                { value: "pending", label: "⏳ Pending" },
                { value: "failed", label: "✗ Gagal" },
              ]}
            />
          </div>

          <Input
            label="Catatan (Opsional)"
            placeholder="Catatan tambahan untuk transaksi ini"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>
      </Modal>

      {/* FAB */}
      <FloatingActionButton
        icon={<Plus size={24} />}
        onClick={() => handleOpenModal()}
        label="Tambah Transaksi"
        color="rose"
      />
    </div>
  );
}
