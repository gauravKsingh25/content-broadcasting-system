'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Clock,
  FileText,
  Upload,
  Radio,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const principalLinks = [
  { href: '/principal', label: 'Overview', icon: LayoutDashboard },
  { href: '/principal/pending', label: 'Pending Review', icon: Clock },
  { href: '/principal/all-content', label: 'All Content', icon: FileText },
]

const teacherLinks = [
  { href: '/teacher', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/teacher/upload', label: 'Upload Content', icon: Upload },
]

function NavLink({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex min-h-11 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A9D8F]/40',
        active
          ? 'border-[#2A9D8F]/40 bg-[#2A9D8F]/20 font-medium text-white shadow-sm'
          : 'border-transparent text-[#b7b7b7] hover:border-white/10 hover:bg-white/5 hover:text-white'
      )}
    >
      <Icon
        size={18}
        className={cn(
          'text-[#9ca3af] transition-colors group-hover:text-white',
          active && 'text-white'
        )}
      />
      {label}
    </Link>
  )
}

export default function Sidebar({ open = false, onClose }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const role = user?.role
  const baseLinks = role === 'principal' ? principalLinks : role === 'teacher' ? teacherLinks : []
  const liveLink = role === 'teacher' && user?.id
    ? { href: `/live/${user.id}`, label: 'Live Link', icon: Radio }
    : null
  const links = liveLink ? [...baseLinks, liveLink] : baseLinks

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-black/45 transition-opacity duration-200 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-dvh w-72 flex-col bg-[#2C2C2C] shadow-2xl transition-transform duration-200 md:w-64 md:translate-x-0 md:shadow-none',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 pb-5 pt-6 md:pb-6 md:pt-8">
          <div>
            <div className="text-4xl leading-none text-[#2A9D8F]" style={{ fontFamily: 'var(--font-heading)' }}>
              CBS
            </div>
            <p className="mt-2 text-xs uppercase tracking-widest text-[#6B6B6B]">
              Content Broadcasting
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              active={pathname === link.href}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2A9D8F] text-sm font-medium text-white">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <span className="text-xs capitalize text-[#9ca3af]">{user?.role}</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout()
              if (onClose) onClose()
            }}
            className="flex w-full items-center gap-2 rounded-xl border border-transparent px-3 py-2.5 text-sm text-[#9ca3af] transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
