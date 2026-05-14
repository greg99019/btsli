'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">BT</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Reset your password</h1>
          <p className="text-slate-500 mt-1 text-sm">Enter your email and we'll send a reset link</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6">
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Return to login
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              Remember your password?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
