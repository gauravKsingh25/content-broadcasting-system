'use client'

import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
}

export default function ContentStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize', config.className)}>
      <Icon size={12} className="mr-1" />
      {config.label}
    </span>
  )
}
