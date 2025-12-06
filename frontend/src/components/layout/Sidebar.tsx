import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  FileText,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type SidebarProps = {
  isMobileMenuOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isMobileMenuOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ArrowRightLeft, label: "Transactions", path: "/transactions" },
    { icon: FileText, label: "Invoices", path: "/invoices" },
    { icon: Users, label: "Clients", path: "/clients" },
  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 via-pink-500 to-fuchsia-500 shadow-lg"></div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              InvoiceEase
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Platform Keuangan UMKM
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px]
                ${
                  isActive
                    ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full min-h-[44px]
            ${
              isActive
                ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-md"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }
          `}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 min-h-[44px]"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 min-h-screen flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay & Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 z-50 md:hidden flex flex-col shadow-xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
