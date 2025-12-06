import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Eye } from "lucide-react";
import { FinancialCard, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Data will be loaded from API - empty for live demo
const revenueData: Array<{ month: string; revenue: number; expenses: number }> =
  [];

const recentTransactions: Array<{
  id: number;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "completed";
  type: "income" | "expense";
}> = [];

const invoiceStatusData: Array<{ name: string; value: number }> = [];

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6B7280"];

export default function DashboardHome() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Selamat datang kembali! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Ringkasan kinerja bisnis Anda bulan ini
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          label="Pendapatan Bulan Ini"
          value="Rp 0"
          subtext="Belum ada data"
          variant="primary"
          icon={<TrendingUp size={20} />}
        />
        <FinancialCard
          label="Pengeluaran"
          value="Rp 0"
          subtext="Belum ada data"
          variant="success"
          icon={<TrendingDown size={20} />}
        />
        <FinancialCard
          label="Laba Bersih"
          value="Rp 0"
          subtext="Siap untuk transaksi pertama"
          variant="secondary"
          icon={<Wallet size={20} />}
        />
        <FinancialCard
          label="Invoice Tertunda"
          value="0"
          subtext="Belum ada invoice"
          variant="warning"
          icon={<Eye size={20} />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card variant="default">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Pendapatan vs Pengeluaran
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tren 6 bulan terakhir
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `Rp ${value}M`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ fill: "#ec4899", r: 4 }}
                  name="Pendapatan"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", r: 4 }}
                  name="Pengeluaran"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Invoice Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card variant="default">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Status Invoice
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Belum ada data invoice
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => `${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Card variant="default">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Transaksi Terbaru
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                5 transaksi terakhir
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(transaction.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
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
                  <Badge
                    variant={
                      transaction.status === "paid" ||
                      transaction.status === "completed"
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                  >
                    {transaction.status === "completed"
                      ? "Selesai"
                      : transaction.status === "paid"
                        ? "Dibayar"
                        : "Pending"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
