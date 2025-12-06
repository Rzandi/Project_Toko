import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageShell from "./components/layout/PageShell";
import DashboardHome from "./pages/DashboardHome";
import TransactionsList from "./pages/TransactionsList";
import InvoicesList from "./pages/Invoices/InvoicesListNew";
import ClientsList from "./pages/Clients/ClientsList";
import SettingsPage from "./pages/Settings/SettingsPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Auth routes (no PageShell) */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected routes (with PageShell) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PageShell>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardHome />} />
                  <Route path="/transactions" element={<TransactionsList />} />
                  <Route path="/invoices" element={<InvoicesList />} />
                  <Route path="/clients" element={<ClientsList />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </PageShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
