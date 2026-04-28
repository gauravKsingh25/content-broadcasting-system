'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import PageHeader from '@/components/shared/PageHeader'
import UploadForm from '@/components/content/UploadForm'

export default function UploadPage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => router.push('/teacher'), 1500)
  }

  return (
    <AuthGuard requiredRole="teacher">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-[#6B6B6B] transition-colors hover:text-[#2C2C2C]">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <PageHeader title="Upload Content" description="Share educational materials with your students" />
      <div className="max-w-4xl">
        <UploadForm onSuccess={handleSuccess} />
      </div>
    </AuthGuard>
  )
}
