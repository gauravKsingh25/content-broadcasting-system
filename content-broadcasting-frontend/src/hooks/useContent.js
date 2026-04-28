'use client'

import { useState, useEffect, useCallback } from 'react'
import { contentApi, approvalApi } from '@/lib/api'

export function useMyContent() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await contentApi.getMyContent()
      setData(res.data?.data || [])
    } catch (err) {
      setError(err)
      console.error('Failed to fetch content:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return { data, isLoading, error, refetch: fetchContent }
}

export function useAllContent() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await approvalApi.getAllContent()
      setData(res.data?.data || [])
    } catch (err) {
      setError(err)
      console.error('Failed to fetch all content:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return { data, isLoading, error, refetch: fetchContent }
}

export function usePendingContent() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await approvalApi.getPendingContent()
      setData(res.data?.data || [])
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return { data, isLoading, error, refetch: fetchContent }
}
