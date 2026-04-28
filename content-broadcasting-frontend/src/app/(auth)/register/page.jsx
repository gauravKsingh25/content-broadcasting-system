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
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['teacher', 'principal'], { required_error: 'Please select a role' }),
})

export default function RegisterPage() {
  const { register: authRegister } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setValue('role', role, { shouldValidate: true })
  }

  const onSubmit = async (values) => {
    setIsLoading(true)

    try {
      await authRegister(values.name, values.email, values.password, values.role)
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
            Create Account
          </h1>
          <p className="mb-8 text-sm text-[#6B6B6B]">Join the broadcasting platform</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm text-[#2C2C2C]">Full Name</Label>
              <Input placeholder="Your full name" className="h-11 border-[#E8E6E1] bg-[#F8F7F4]" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[#2C2C2C]">Email</Label>
              <Input type="email" placeholder="you@school.com" className="h-11 border-[#E8E6E1] bg-[#F8F7F4]" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[#2C2C2C]">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 border-[#E8E6E1] bg-[#F8F7F4] pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[#2C2C2C]">I am a...</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {['teacher', 'principal'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      'h-11 rounded-xl border text-sm capitalize transition-all duration-150',
                      selectedRole === role
                        ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white'
                        : 'border-[#E8E6E1] text-[#6B6B6B] hover:border-[#2C2C2C]'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full bg-[#2C2C2C] text-white transition-colors duration-200 hover:bg-[#2A9D8F]"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#2A9D8F] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
