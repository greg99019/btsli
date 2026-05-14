'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type AuthUser = {
  id: string
  email: string
  name?: string
  role: 'CLIENT' | 'COACH' | 'ORG_ADMIN' | 'SUPER_ADMIN'
}

const roleDescriptions: Record<AuthUser['role'], string> = {
  CLIENT: 'Continue your enrolled coursework and track lesson progress.',
  COACH: 'Review client leads, manage availability, and support delivery.',
  ORG_ADMIN: 'Access the learning portal and support organizational learners.',
  SUPER_ADMIN: 'Oversee the learning portal and administrative workflows.',
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        if (!res.ok) {
          router.replace('/login')
          return
        }

        const data = (await res.json()) as { user: AuthUser }
        setUser(data.user)
      } catch {
        setError('Unable to load your dashboard right now.')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const primaryActions = useMemo(() => {
    if (!user) return []

    if (user.role === 'COACH') {
      return [
        { href: '/coach/leads', label: 'Open coach leads', description: 'Review intake submissions and follow-up opportunities.' },
        { href: '/coach/slots', label: 'Manage availability', description: 'Update your bookable coaching slots.' },
      ]
    }

    return [
      { href: '/app/courses', label: 'Open my courses', description: 'Jump back into the MongoDB-backed LMS experience.' },
      { href: '/services', label: 'Explore services', description: 'Review consulting and coaching offerings.' },
    ]
  }, [user])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    router.replace('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading your MongoDB dashboard…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">We couldn&apos;t load your dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">{error || 'Please sign in again to continue.'}</p>
          <Link href="/login" className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Return to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">BTSLI Portal</p>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 p-8 text-white shadow-lg">
          <p className="text-sm text-blue-100">Signed in as {user.email}</p>
          <h2 className="mt-2 text-3xl font-bold">{user.role.replace('_', ' ')}</h2>
          <p className="mt-3 max-w-2xl text-sm text-blue-100">{roleDescriptions[user.role]}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {primaryActions.map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{action.label}</h3>
                <span className="text-blue-600 transition group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-amber-900">MongoDB path is now the active portal route</h3>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            The newer Supabase-only training pages are being bypassed so your deployed site follows the existing MongoDB + Prisma + API stack already present in this repository.
          </p>
        </section>
      </main>
    </div>
  )
}
