'use client'

import { useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import DashboardShell from '@/components/layout/DashboardShell'
import Sidebar from '@/components/layout/Sidebar'
import TopNav from '@/components/layout/TopNav'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex min-h-screen overflow-x-hidden bg-[#F8F7F4]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col md:ml-64">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <DashboardShell>
              <div className="animate-in fade-in duration-300">{children}</div>
            </DashboardShell>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
