'use client'

import Link from 'next/link'
import { Clock, FileText, Upload, ArrowRight } from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import PageHeader from '@/components/shared/PageHeader'
import ContentTable from '@/components/content/ContentTable'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useAllContent } from '@/hooks/useContent'

export default function PrincipalPage() {
  const { data: contents, isLoading } = useAllContent()

  const stats = [
    { label: 'Total Content', value: contents.length, icon: FileText, color: 'border-[#2C2C2C]' },
    { label: 'Pending Review', value: contents.filter((item) => item.status === 'pending').length, icon: Clock, color: 'border-amber-400' },
    { label: 'Approved Live', value: contents.filter((item) => item.status === 'approved').length, icon: Upload, color: 'border-[#2A9D8F]' },
  ]

  return (
    <AuthGuard requiredRole="principal">
      <PageHeader
        title="Overview"
        description="Track submitted content, review activity, and live approvals at a glance"
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border border-[#E8E6E1] border-l-4 bg-white p-6 shadow-sm ${stat.color}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#6B6B6B]">{stat.label}</p>
                <div className="mt-2 text-3xl font-normal text-[#2C2C2C]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {isLoading ? '—' : stat.value}
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2A9D8F]/10 text-[#2A9D8F]">
                <stat.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No content has been uploaded yet"
          description="As soon as teachers upload content, it will appear here for review."
          action={
            <Link href="/principal/pending">
              <Button className="bg-[#2C2C2C] text-white hover:bg-[#2A9D8F]">
                Review pending items
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          }
        />
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-normal text-[#2C2C2C]" style={{ fontFamily: 'var(--font-heading)' }}>
                Recent activity
              </h3>
              <p className="text-sm text-[#6B6B6B]">Latest submissions across all teachers.</p>
            </div>
            <Link href="/principal/all-content" className="text-sm font-medium text-[#2A9D8F] hover:underline">
              View all content
            </Link>
          </div>

          <ContentTable contents={contents.slice(0, 6)} />
        </section>
      )}
    </AuthGuard>
  )
}
