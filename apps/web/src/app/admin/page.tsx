'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Stats {
  totalUsers: number; totalModules: number; totalCompletions: number
  completionRate: number
  recentCompletions: { userName: string; moduleName: string; completedAt: string; score?: number }[]
  moduleStats: { moduleId: string; title: string; completions: number; avgScore?: number }[]
}

export default function AdminPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) setStats(await statsRes.json())
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Platform overview and analytics</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? 0, color: 'blue' },
            { label: 'Modules', value: stats?.totalModules ?? 0, color: 'violet' },
            { label: 'Completions', value: stats?.totalCompletions ?? 0, color: 'emerald' },
            { label: 'Completion Rate', value: (stats?.completionRate ?? 0).toFixed(1) + '%', color: 'amber' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{card.label}</p>
              <p className={"text-3xl font-bold mt-1 text-" + card.color + "-600"}>{card.value}</p>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Recent Completions</h2>
            {stats?.recentCompletions.length === 0
              ? <p className="text-sm text-slate-400">No completions yet.</p>
              : <div className="space-y-3">
                  {(stats?.recentCompletions ?? []).map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.userName}</p>
                        <p className="text-xs text-slate-500">{c.moduleName}</p>
                      </div>
                      <div className="text-right">
                        {c.score != null && <p className="text-sm font-semibold text-emerald-600">{Math.round(c.score * 100)}%</p>}
                        <p className="text-xs text-slate-400">{new Date(c.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Module Performance</h2>
            {stats?.moduleStats.length === 0
              ? <p className="text-sm text-slate-400">No data yet.</p>
              : <div className="space-y-3">
                  {(stats?.moduleStats ?? []).map(m => (
                    <div key={m.moduleId} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <p className="text-sm text-slate-700 truncate flex-1 mr-4">{m.title}</p>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-blue-600">{m.completions} completions</p>
                        {m.avgScore != null && <p className="text-xs text-slate-400">Avg: {Math.round(m.avgScore * 100)}%</p>}
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/admin/modules/new', label: 'New Module' },
              { href: '/admin/users', label: 'Manage Users' },
              { href: '/admin/announcements', label: 'Post Announcement' },
              { href: '/admin/reports', label: 'View Reports' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">{a.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
