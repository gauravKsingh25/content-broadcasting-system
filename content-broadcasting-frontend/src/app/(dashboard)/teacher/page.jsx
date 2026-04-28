'use client'

import Link from 'next/link'
import { FileText, Upload } from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ContentTable from '@/components/content/ContentTable'
import { Button } from '@/components/ui/button'
import { useMyContent } from '@/hooks/useContent'

export default function TeacherDashboardPage() {
  const { data: contents, isLoading } = useMyContent()

  return (
    <AuthGuard requiredRole="teacher">
      <PageHeader
        title="My Dashboard"
        description="Track your uploads and review status"
        action={
          <Link href="/teacher/upload">
            <Button className="bg-[#2C2C2C] text-white hover:bg-[#2A9D8F]">
              <Upload size={16} className="mr-2" />
              Upload content
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No uploads yet"
          description="Upload your first lesson to start broadcasting content to students."
          action={
            <Link href="/teacher/upload">
              <Button className="bg-[#2C2C2C] text-white hover:bg-[#2A9D8F]">
                Upload content
              </Button>
            </Link>
          }
        />
      ) : (
        <ContentTable contents={contents} />
      )}
    </AuthGuard>
  )
}
