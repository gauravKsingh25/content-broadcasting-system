'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Paperclip, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { contentApi } from '@/lib/api'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const emptyStringToUndefined = (value) => {
  if (typeof value === 'string' && value.trim() === '') return undefined
  return value
}

const uploadSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    subject: z.string().min(1, 'Subject is required'),
    startTime: z.preprocess(emptyStringToUndefined, z.string().optional()),
    endTime: z.preprocess(emptyStringToUndefined, z.string().optional()),
    rotationDuration: z.preprocess(
      emptyStringToUndefined,
      z.coerce.number().int().positive().optional()
    ),
    file: z.any().refine((value) => value?.length > 0, 'Please choose a file'),
  })
  .refine(
    (data) => (!data.startTime && !data.endTime) || (data.startTime && data.endTime),
    {
      message: 'Provide both start and end times',
      path: ['endTime'],
    }
  )
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true
      return new Date(data.endTime) > new Date(data.startTime)
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

export default function UploadForm({ onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadSchema),
  })

  const handleFileChange = (event) => {
    setValue('file', event.target.files, { shouldValidate: true })
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('subject', values.subject)
      formData.append('file', values.file[0])

      if (values.startTime) {
        formData.append('startTime', values.startTime)
      }

      if (values.endTime) {
        formData.append('endTime', values.endTime)
      }

      if (values.rotationDuration) {
        formData.append('rotationDuration', String(values.rotationDuration))
      }

      await contentApi.uploadContent(formData)
      toast.success('Content uploaded successfully.')

      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-[#E8E6E1] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="space-y-2">
        <Label className="text-sm text-[#2C2C2C]">Title</Label>
        <Input placeholder="Content title" className="border-[#E8E6E1] bg-[#F8F7F4]" {...register('title')} />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[#2C2C2C]">Description</Label>
        <Textarea placeholder="Describe the content" className="min-h-32 border-[#E8E6E1] bg-[#F8F7F4]" {...register('description')} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[#2C2C2C]">Subject</Label>
        <Input placeholder="maths, science, english..." className="border-[#E8E6E1] bg-[#F8F7F4]" {...register('subject')} />
        {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm text-[#2C2C2C]">Start time (optional)</Label>
          <Input type="datetime-local" className="border-[#E8E6E1] bg-[#F8F7F4]" {...register('startTime')} />
          {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-[#2C2C2C]">End time (optional)</Label>
          <Input type="datetime-local" className="border-[#E8E6E1] bg-[#F8F7F4]" {...register('endTime')} />
          {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[#2C2C2C]">Rotation duration (minutes)</Label>
        <Input
          type="number"
          min="1"
          placeholder="5"
          className="border-[#E8E6E1] bg-[#F8F7F4]"
          {...register('rotationDuration')}
        />
        {errors.rotationDuration && <p className="text-xs text-red-500">{errors.rotationDuration.message}</p>}
        <p className="text-xs text-[#6B6B6B]">Leave blank to use the default 5-minute rotation.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[#2C2C2C]">File</Label>
        <label className="flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-dashed border-[#E8E6E1] bg-[#F8F7F4] px-4 py-4 text-sm text-[#6B6B6B] transition-colors hover:border-[#2A9D8F] hover:text-[#2C2C2C] sm:flex-row sm:items-center">
          <Paperclip size={16} />
          <span>Choose a file to upload</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        {errors.file && <p className="text-xs text-red-500">{errors.file.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-12 w-full bg-[#2C2C2C] text-white hover:bg-[#2A9D8F]">
        {isSubmitting ? <LoadingSpinner size="sm" /> : <><Upload size={16} className="mr-2" /> Upload Content</>}
      </Button>
    </form>
  )
}
