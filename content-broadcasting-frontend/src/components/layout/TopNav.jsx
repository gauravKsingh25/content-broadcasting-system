'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const pageTitles = {
  '/principal': 'Overview',
  '/principal/pending': 'Pending Review',
  '/principal/all-content': 'All Content',
  '/teacher': 'My Dashboard',
  '/teacher/upload': 'Upload Content',
}

export default function TopNav({ onMenuClick }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-[#E8E6E1] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-xl border border-[#E8E6E1] bg-white p-2 text-[#2C2C2C] shadow-sm transition-colors hover:bg-[#F8F7F4] md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium text-[#2C2C2C]">{pageTitle}</h2>
          <p className="text-xs text-[#6B6B6B] sm:hidden">{user?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="text-[#6B6B6B] transition-colors hover:text-[#2C2C2C]">
          <Bell size={20} />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-medium text-[#2C2C2C]">{user?.name}</span>
          <span
            className={cn(
              'rounded-full border px-2 py-1 text-xs font-medium capitalize',
              user?.role === 'principal'
                ? 'border-[#2A9D8F]/20 bg-[#2A9D8F]/10 text-[#2A9D8F]'
                : 'border-[#2C2C2C]/20 bg-[#2C2C2C]/10 text-[#2C2C2C]'
            )}
          >
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  )
}
