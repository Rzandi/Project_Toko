import React, { useState } from "react";
import { InvoiceFilters } from "../../hooks/useInvoices";

interface InvoiceFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  onFiltersChange: (filters: InvoiceFilters) => void;
}

export const InvoiceFiltersComponent: React.FC<InvoiceFiltersProps> = ({
  isOpen,
  onToggle,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: "",
    startDate: undefined,
    endDate: undefined,
    clientId: undefined,
    skip: 0,
    limit: 10,
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value as any });
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "startDate" | "endDate",
  ) => {
    setFilters({ ...filters, [field]: e.target.value || undefined });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, limit: Number(e.target.value), skip: 0 });
  };

  const handleApply = () => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    const resetFilters: InvoiceFilters = {
      status: "",
      startDate: undefined,
      endDate: undefined,
      clientId: undefined,
      skip: 0,
      limit: 10,
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        <span>🔽</span>
        {isOpen ? "Sembunyikan Filter" : "Tampilkan Filter"}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label
                htmlFor="filter-status"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Status
              </label>
              <select
                id="filter-status"
                name="status"
                value={filters.status || ""}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Terkirim</option>
                <option value="paid">Dibayar</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="filter-startDate"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Dari Tanggal
              </label>
              <input
                id="filter-startDate"
                name="startDate"
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleDateChange(e, "startDate")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="filter-endDate"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Sampai Tanggal
              </label>
              <input
                id="filter-endDate"
                name="endDate"
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleDateChange(e, "endDate")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Items Per Page */}
            <div>
              <label
                htmlFor="filter-limit"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Item Per Halaman
              </label>
              <select
                id="filter-limit"
                name="limit"
                value={filters.limit || 10}
                onChange={handleLimitChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Terapkan Filter
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFiltersComponent;
