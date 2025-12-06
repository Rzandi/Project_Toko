import React from "react";
import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  const [isDark, setIsDark] = React.useState(false);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Hide search on small mobile */}
        <button className="hidden sm:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Search size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Bell size={20} />
        </button>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.email || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
