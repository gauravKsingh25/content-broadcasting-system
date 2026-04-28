import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const formatDate = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const getSubjectColor = (subject) => {
  const colors = {
    maths: 'bg-blue-50 text-blue-700',
    science: 'bg-green-50 text-green-700',
    english: 'bg-purple-50 text-purple-700',
    history: 'bg-orange-50 text-orange-700',
    geography: 'bg-teal-50 text-teal-700',
    computer: 'bg-indigo-50 text-indigo-700',
  }

  return colors[subject?.toLowerCase()] || 'bg-gray-50 text-gray-700'
}