'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { saveAuth, clearAuth, getUser, getToken } from '@/lib/auth'
import { toast } from 'sonner'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = getUser()
    if (savedUser) setUser(savedUser)
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password)
      const { token, data } = res.data
      const userData = data?.user || data
      const tokenValue = data?.token || token

      saveAuth(tokenValue, userData)
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}!`)

      if (userData.role === 'principal') {
        router.push('/principal')
      } else {
        router.push('/teacher')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
      throw err
    }
  }

  const register = async (name, email, password, role) => {
    try {
      await authApi.register(name, email, password, role)
      toast.success('Account created! Signing you in...')
      await login(email, password)
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      toast.error(msg)
      throw err
    }
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/login')
    toast.success('Logged out successfully.')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: Boolean(getToken()) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}