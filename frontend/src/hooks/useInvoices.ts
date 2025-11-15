import { useState, useCallback } from 'react';
import api from '../services/api';

export interface LineItem {
  _id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number; // percentage 0-100
}

export interface InvoiceClient {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface Invoice {
  _id: string;
  user: string;
  invoiceNumber: string;
  client: InvoiceClient;
  items: LineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid';
  currency: string;
  issuedDate: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFilters {
  status?: 'draft' | 'sent' | 'paid' | '';
  startDate?: string;
  endDate?: string;
  clientId?: string;
  skip?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  skip: number;
  limit: number;
  pages: number;
}

interface InvoiceResponse {
  success: boolean;
  data: Invoice | Invoice[];
  pagination?: PaginationInfo;
  invoiceNumber?: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    skip: 0,
    limit: 10,
    pages: 0,
  });

  // Fetch invoices with filters
  const fetchInvoices = useCallback(
    async (filters: InvoiceFilters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.clientId) params.append('clientId', filters.clientId);
        if (filters.skip !== undefined) params.append('skip', String(filters.skip));
        if (filters.limit) params.append('limit', String(filters.limit));

        const response = await api.get<InvoiceResponse>(
          `/invoices?${params.toString()}`
        );

        if (response.data.success) {
          setInvoices(Array.isArray(response.data.data) ? response.data.data : []);
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal mengambil data invoice';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create new invoice
  const createInvoice = useCallback(
    async (
      data: Omit<Invoice, '_id' | 'user' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post<InvoiceResponse>('/invoices', data);

        if (response.data.success) {
          const newInvoice = response.data.data as Invoice;
          setInvoices((prev) => [newInvoice, ...prev]);
          return newInvoice;
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal membuat invoice';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update invoice
  const updateInvoice = useCallback(
    async (
      id: string,
      data: Partial<Omit<Invoice, '_id' | 'user' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put<InvoiceResponse>(
          `/invoices/${id}`,
          data
        );

        if (response.data.success) {
          const updatedInvoice = response.data.data as Invoice;
          setInvoices((prev) =>
            prev.map((inv) => (inv._id === id ? updatedInvoice : inv))
          );
          return updatedInvoice;
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Gagal memperbarui invoice';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete invoice
  const deleteInvoice = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete<InvoiceResponse>(
        `/invoices/${id}`
      );

      if (response.data.success) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
        return true;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal menghapus invoice';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single invoice
  const getInvoice = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<InvoiceResponse>(
        `/invoices/${id}`
      );

      if (response.data.success) {
        return response.data.data as Invoice;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Gagal mengambil detail invoice';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get next invoice number
  const getNextInvoiceNumber = useCallback(async () => {
    try {
      const response = await api.get<InvoiceResponse>(
        '/invoices/number/next'
      );

      if (response.data.success && response.data.invoiceNumber) {
        return response.data.invoiceNumber;
      }
      return 'INV-001'; // Fallback
    } catch {
      return 'INV-001'; // Fallback on error
    }
  }, []);

  // Refetch with same filters
  const refetch = useCallback(
    (filters?: InvoiceFilters) => {
      return fetchInvoices(filters || {});
    },
    [fetchInvoices]
  );

  return {
    invoices,
    loading,
    error,
    pagination,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    getNextInvoiceNumber,
    refetch,
  };
};
