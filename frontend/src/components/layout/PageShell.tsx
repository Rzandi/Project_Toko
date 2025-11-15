import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

type Props = {
  children: React.ReactNode
}

export default function PageShell({ children }: Props) {
  return (
    <div className="app-shell flex bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
