'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Radio, RefreshCw, Satellite } from 'lucide-react'
import { publicApi } from '@/lib/api'

export default function LivePage() {
  const { teacherId } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const subject = searchParams.get('subject')

  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [countdown, setCountdown] = useState(30)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchLive = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const res = await publicApi.getLiveContent(teacherId, subject)
      setContent(res.data?.data || null)
      setLastUpdated(new Date())
      setCountdown(30)
    } catch {
      setContent(null)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [teacherId, subject])

  useEffect(() => {
    fetchLive()
  }, [fetchLive])

  useEffect(() => {
    const interval = setInterval(fetchLive, 30000)
    return () => clearInterval(interval)
  }, [fetchLive])

  useEffect(() => {
    const timer = setInterval(() => setCountdown((current) => (current > 0 ? current - 1 : 30)), 1000)
    return () => clearInterval(timer)
  }, [])

  const subjects = ['Maths', 'Science', 'English', 'History', 'Geography', 'Computer']

  const setSubjectFilter = (value) => {
    const params = value ? `?subject=${value}` : ''
    router.push(`/live/${teacherId}${params}`)
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  return (
    <div className="flex min-h-screen flex-col bg-[#2C2C2C] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div className="text-2xl text-[#2A9D8F]" style={{ fontFamily: 'var(--font-heading)' }}>
          CBS
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs uppercase tracking-wide text-white/60">Live Broadcasting</span>
        </div>
        <div className="text-sm text-white/40">Teacher #{teacherId}</div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSubjectFilter('')}
            className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
              !subject
                ? 'border-[#2A9D8F] bg-[#2A9D8F] text-white'
                : 'border-white/20 text-white/50 hover:border-white/40'
            }`}
          >
            All
          </button>
          {subjects.map((value) => (
            <button
              key={value}
              onClick={() => setSubjectFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                subject === value
                  ? 'border-[#2A9D8F] bg-[#2A9D8F] text-white'
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="w-full max-w-2xl">
          {isLoading ? (
            <div className="space-y-4 rounded-2xl border border-[#2A9D8F]/20 bg-[#1a1a1a] p-8 animate-pulse">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-8 w-3/4 rounded bg-white/10" />
              <div className="h-48 rounded-xl bg-white/10" />
            </div>
          ) : content ? (
            <div className="overflow-hidden rounded-2xl border border-[#2A9D8F]/30 bg-[#1a1a1a]">
              <div className="h-1 bg-gradient-to-r from-[#2A9D8F] to-[#238a7e]" />
              <div className="p-8">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full border border-[#2A9D8F]/30 bg-[#2A9D8F]/20 px-3 py-1 text-xs capitalize text-[#2A9D8F]">
                    {content.subject}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    LIVE
                  </span>
                </div>

                <h2 className="mb-3 text-4xl font-normal leading-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {content.title}
                </h2>

                {content.description && <p className="mb-6 text-base text-white/50">{content.description}</p>}

                <div className="mb-6 flex max-h-96 items-center justify-center overflow-hidden rounded-xl bg-black">
                  <img
                    src={`${apiBaseUrl}/${content.fileUrl}`}
                    alt={content.title}
                    className="max-h-96 max-w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.parentElement.style.display = 'none'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/30">
                  <div className="flex items-center gap-1.5">
                    <Radio size={12} />
                    Broadcasting for Teacher #{teacherId}
                  </div>
                  <span className="capitalize">{content.fileType}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#2A9D8F]/10">
                <Satellite size={40} className="text-[#2A9D8F]" />
              </div>
              <h2 className="mb-3 text-4xl font-normal text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                No Live Content
              </h2>
              <p className="text-base text-white/40">Nothing is broadcasting right now. Check back soon.</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs text-white/30">
          {lastUpdated && <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>}
          <span>·</span>
          <span>Refreshing in {countdown}s</span>
          <button
            onClick={fetchLive}
            disabled={isRefreshing}
            className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 transition-all hover:border-[#2A9D8F]/50 hover:text-[#2A9D8F]"
          >
            <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </main>
    </div>
  )
}
