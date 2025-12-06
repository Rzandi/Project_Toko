import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell flex bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 min-h-screen w-full md:w-auto">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
