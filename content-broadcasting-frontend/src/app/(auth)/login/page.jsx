'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values) => {
    setIsLoading(true)

    try {
      await login(values.email, values.password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#2C2C2C] px-12 md:flex md:w-1/2">
        <div className="absolute left-10 top-20 h-64 w-64 animate-pulse rounded-full bg-[#2A9D8F] opacity-5 blur-3xl" />
        <div
          className="absolute bottom-20 right-10 h-80 w-80 animate-pulse rounded-full bg-[#2A9D8F] opacity-5 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#2A9D8F] opacity-5 blur-3xl"
          style={{ animationDelay: '2s' }}
        />

        <div className="relative z-10 text-center">
          <div className="mb-2 text-7xl leading-none text-[#2A9D8F]" style={{ fontFamily: 'var(--font-heading)' }}>
            CBS
          </div>
          <p className="mb-12 text-sm uppercase tracking-widest text-[#9ca3af]">
            Content Broadcasting System
          </p>
          <div className="space-y-4 text-left">
            {['Secure role-based access control', 'Real-time content broadcasting', 'Subject-based scheduling'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle size={18} className="flex-shrink-0 text-[#2A9D8F]" />
                <span className="text-sm text-[#9ca3af]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#F8F7F4] px-4 py-8 sm:px-6 md:w-1/2 md:px-8">
        <div className="w-full max-w-md rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <h1 className="mb-1 text-3xl font-normal text-[#2C2C2C]" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-[#6B6B6B]">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-[#2C2C2C]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.com"
                className="h-11 border-[#E8E6E1] bg-[#F8F7F4] focus:border-[#2A9D8F] focus:ring-[#2A9D8F]"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-[#2C2C2C]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 border-[#E8E6E1] bg-[#F8F7F4] pr-10 focus:border-[#2A9D8F] focus:ring-[#2A9D8F]"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#2C2C2C]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full bg-[#2C2C2C] text-white transition-colors duration-200 hover:bg-[#2A9D8F]"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-[#2A9D8F] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
