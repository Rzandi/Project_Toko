import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">☰</button>
        <h1 className="text-lg font-semibold">InvoiceEase</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-sm px-3 py-1 rounded bg-indigo-600 text-white">+ Invoice</button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
          <button 
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
