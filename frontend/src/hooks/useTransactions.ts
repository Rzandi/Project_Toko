import { useState, useCallback } from 'react';
import api from '../services/api';

export interface Transaction {
  _id: string;
  user: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  currency?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE' | '';
  category?: string;
  skip?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  skip: number;
  limit: number;
  pages: number;
}

interface TransactionResponse {
  success: boolean;
  data: Transaction | Transaction[];
  pagination?: PaginationInfo;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    skip: 0,
    limit: 10,
    pages: 0,
  });

  // Fetch transactions with filters
  const fetchTransactions = useCallback(
    async (filters: TransactionFilters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.type) params.append('type', filters.type);
        if (filters.category) params.append('category', filters.category);
        if (filters.skip !== undefined) params.append('skip', String(filters.skip));
        if (filters.limit) params.append('limit', String(filters.limit));

        const response = await api.get<TransactionResponse>(
          `/transactions?${params.toString()}`
        );

        if (response.data.success) {
          setTransactions(Array.isArray(response.data.data) ? response.data.data : []);
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal mengambil data transaksi';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create new transaction
  const createTransaction = useCallback(
    async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post<TransactionResponse>('/transactions', data);

        if (response.data.success) {
          const newTransaction = response.data.data as Transaction;
          setTransactions((prev) => [newTransaction, ...prev]);
          return newTransaction;
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal membuat transaksi';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update transaction
  const updateTransaction = useCallback(
    async (
      id: string,
      data: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put<TransactionResponse>(
          `/transactions/${id}`,
          data
        );

        if (response.data.success) {
          const updatedTransaction = response.data.data as Transaction;
          setTransactions((prev) =>
            prev.map((t) => (t._id === id ? updatedTransaction : t))
          );
          return updatedTransaction;
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memperbarui transaksi';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete<TransactionResponse>(
        `/transactions/${id}`
      );

      if (response.data.success) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        return true;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal menghapus transaksi';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single transaction
  const getTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<TransactionResponse>(
        `/transactions/${id}`
      );

      if (response.data.success) {
        return response.data.data as Transaction;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal mengambil detail transaksi';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch with same filters
  const refetch = useCallback(
    (filters?: TransactionFilters) => {
      return fetchTransactions(filters || {});
    },
    [fetchTransactions]
  );

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    refetch,
  };
};
