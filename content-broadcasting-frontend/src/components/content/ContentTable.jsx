'use client'

import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn, formatDate, getSubjectColor } from '@/lib/utils'

const statusClassMap = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

export default function ContentTable({
  contents = [],
  isLoading = false,
  showActions = false,
  onApprove,
  onReject,
  actionLoadingId = null,
  actionLoadingType = null,
}) {
  if (isLoading) {
    return null
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-[#F8F7F4] to-white text-[#6B6B6B]">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Uploaded</th>
              {showActions && <th className="px-6 py-4 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => {
              const isRowLoading = actionLoadingId === content.id
              const isApproving = isRowLoading && actionLoadingType === 'approve'
              const isRejecting = isRowLoading && actionLoadingType === 'reject'

              return (
                <tr key={content.id} className="border-t border-[#E8E6E1] bg-white transition-colors hover:bg-[#FCFBF9]">
                <td className="px-6 py-4 align-top">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2A9D8F]/10 text-[#2A9D8F]">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-[#2C2C2C]">{content.title}</div>
                      <div className="line-clamp-2 text-xs text-[#6B6B6B]">{content.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <span className={cn('rounded-full px-3 py-1 text-xs font-medium shadow-sm', getSubjectColor(content.subject))}>
                    {content.subject}
                  </span>
                </td>
                <td className="px-6 py-4 align-top">
                  <Badge className={cn('rounded-full border px-2.5 py-1 text-xs font-medium capitalize shadow-sm', statusClassMap[content.status] || statusClassMap.pending)}>
                    {content.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 align-top text-[#6B6B6B]">{formatDate(content.createdAt || content.created_at)}</td>
                {showActions && (
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isRowLoading}
                        onClick={() => onApprove?.(content)}
                      >
                        {isApproving ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isRowLoading}
                        onClick={() => onReject?.(content)}
                      >
                        {isRejecting ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>
                  </td>
                )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
