'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/database'

const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']

interface AdminStats {
  totalUsers: number
  totalModules: number
  completedEnrollments: number
  activeOrgs: number
}

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalModules: 0, completedEnrollments: 0, activeOrgs: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const profileRes = await supabase.from('profiles').select('*, organizations(name)').eq('id', user.id).single()
      const p = profileRes.data as Profile | null
      if (!p || !ADMIN_ROLES.includes(p.role)) { router.replace('/dashboard'); return }
      setProfile(p)

      const [usersRes, modulesRes, progressRes, orgsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('training_modules').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('user_progress').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ])

      setStats({
        totalUsers: usersRes.count ?? 0,
        totalModules: modulesRes.count ?? 0,
        completedEnrollments: progressRes.count ?? 0,
        activeOrgs: orgsRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: 'Active Users', value: stats.totalUsers, icon: '👥', color: 'blue', href: '/admin/users' },
    { label: 'Published Modules', value: stats.totalModules, icon: '📚', color: 'violet', href: '/admin/modules' },
    { label: 'Completions', value: stats.completedEnrollments, icon: '✅', color: 'emerald', href: '/admin/reports' },
    { label: 'Organizations', value: stats.activeOrgs, icon: '🏢', color: 'amber', href: '/admin/organizations' },
  ]

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Platform overview and quick actions</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(card => (
            <a key={card.label} href={card.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition-colors block">
              <div className="text-3xl mb-3">{card.icon}</div>
              <p className="text-3xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm text-slate-500 mt-1">{card.label}</p>
            </a>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/admin/modules/new', label: 'Create Training Module', desc: 'Add a new module to the platform', icon: '➕' },
            { href: '/admin/users', label: 'Manage Users', desc: 'View, invite, and manage user roles', icon: '👤' },
            { href: '/admin/announcements', label: 'Post Announcement', desc: 'Send an organization-wide message', icon: '📢' },
            { href: '/admin/reports', label: 'View Reports', desc: 'Export completion data and analytics', icon: '📊' },
          ].map(action => (
            <a key={action.href} href={action.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-4">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </PlatformLayout>
  )
}
