'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getUser()

    if (!user) {
      router.replace('/login')
    } else if (user.role === 'principal') {
      router.replace('/principal')
    } else {
      router.replace('/teacher')
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-[#F8F7F4]">
      <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-[#2A9D8F]" />
    </div>
  )
}