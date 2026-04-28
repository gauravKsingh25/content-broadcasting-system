'use client'

import Link from 'next/link'
import { FileText, Clock, CheckCircle2, XCircle, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn, formatDate, formatFileSize, getSubjectColor } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', icon: CheckCircle2, className: 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' },
}

export default function ContentCard({ content }) {
  const status = statusConfig[content.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <Card className="group overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="space-y-3 border-b border-[#E8E6E1] bg-gradient-to-br from-[#F8F7F4] to-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-normal text-[#2C2C2C]" style={{ fontFamily: 'var(--font-heading)' }}>
              {content.title}
            </h3>
            <p className="mt-1 text-sm text-[#6B6B6B]">{content.description}</p>
          </div>
          <Badge className={cn('rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm', status.className)}>
            <StatusIcon size={12} className="mr-1" /> {status.label}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={cn('rounded-full px-3 py-1 text-xs font-medium shadow-sm', getSubjectColor(content.subject))}>
            {content.subject}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6B6B6B]">
            {content.type || 'File'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="grid gap-3 text-sm text-[#6B6B6B] sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl bg-[#F8F7F4] px-3 py-2">
            <CalendarDays size={14} />
            <span>{formatDate(content.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#F8F7F4] px-3 py-2">
            <FileText size={14} />
            <span>{content.fileName || 'Attached file'}</span>
          </div>
          {content.fileSize ? (
            <div className="flex items-center gap-2 rounded-xl bg-[#F8F7F4] px-3 py-2 sm:col-span-2">
              <span>{formatFileSize(content.fileSize)}</span>
            </div>
          ) : null}
        </div>

        {content.subject && (
          <Link href={`/live/${content.teacherId || ''}`} className="inline-flex text-sm font-medium text-[#2A9D8F] transition-colors hover:text-[#238377] hover:underline">
            View live link
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
