'use client'

import AuthGuard from '@/components/auth/AuthGuard'
import PageHeader from '@/components/shared/PageHeader'
import ContentTable from '@/components/content/ContentTable'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAllContent } from '@/hooks/useContent'
import { FileText } from 'lucide-react'

export default function AllContentPage() {
  const { data: contents, isLoading } = useAllContent()

  return (
    <AuthGuard requiredRole="principal">
      <PageHeader title="All Content" description="Browse every uploaded item across the platform" />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No content available"
          description="Uploaded content will appear here once teachers start submitting items."
        />
      ) : (
        <ContentTable contents={contents} />
      )}
    </AuthGuard>
  )
}
