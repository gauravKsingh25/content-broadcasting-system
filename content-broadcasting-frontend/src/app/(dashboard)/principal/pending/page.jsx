'use client'

import { useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import PageHeader from '@/components/shared/PageHeader'
import ContentTable from '@/components/content/ContentTable'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePendingContent } from '@/hooks/useContent'
import { approvalApi } from '@/lib/api'
import { Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function PendingContentPage() {
  const { data: contents, isLoading, refetch } = usePendingContent()
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [actionLoadingType, setActionLoadingType] = useState(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedContent, setSelectedContent] = useState(null)

  const handleApprove = async (content) => {
    if (!content?.id) return

    setActionLoadingId(content.id)
    setActionLoadingType('approve')

    try {
      await approvalApi.approveContent(content.id)
      toast.success('Content approved.')
      await refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve content.')
    } finally {
      setActionLoadingId(null)
      setActionLoadingType(null)
    }
  }

  const openRejectDialog = (content) => {
    setSelectedContent(content)
    setRejectionReason('')
    setRejectDialogOpen(true)
  }

  const handleReject = async () => {
    if (!selectedContent?.id) return

    const reason = rejectionReason.trim()
    if (!reason) {
      toast.error('Rejection reason is required.')
      return
    }

    setActionLoadingId(selectedContent.id)
    setActionLoadingType('reject')

    try {
      await approvalApi.rejectContent(selectedContent.id, reason)
      toast.success('Content rejected.')
      setRejectDialogOpen(false)
      await refetch()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject content.')
    } finally {
      setActionLoadingId(null)
      setActionLoadingType(null)
      setSelectedContent(null)
      setRejectionReason('')
    }
  }

  const handleDialogChange = (open) => {
    setRejectDialogOpen(open)
    if (!open) {
      setSelectedContent(null)
      setRejectionReason('')
    }
  }

  return (
    <AuthGuard requiredRole="principal">
      <PageHeader title="Pending Review" description="Review uploaded content before it goes live" />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Nothing is waiting for review"
          description="Once teachers upload content, pending items will appear here."
        />
      ) : (
        <ContentTable
          contents={contents}
          showActions
          onApprove={handleApprove}
          onReject={openRejectDialog}
          actionLoadingId={actionLoadingId}
          actionLoadingType={actionLoadingType}
        />
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject content</DialogTitle>
            <DialogDescription>Provide a reason to send back to the teacher.</DialogDescription>
          </DialogHeader>
          {selectedContent?.title && (
            <p className="text-sm text-[#6B6B6B]">{selectedContent.title}</p>
          )}
          <Textarea
            placeholder="Enter a clear reason for rejection"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => handleDialogChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleReject}
              disabled={actionLoadingType === 'reject' || !rejectionReason.trim()}
            >
              {actionLoadingType === 'reject' ? 'Rejecting...' : 'Reject content'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}
