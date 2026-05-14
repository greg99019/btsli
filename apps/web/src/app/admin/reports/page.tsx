'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Stats {
  totalUsers: number; totalModules: number; totalCompletions: number; completionRate: number
  recentCompletions: { userName: string; moduleName: string; completedAt: string; score?: number }[]
  moduleStats: { moduleId: string; title: string; completions: number; avgScore?: number }[]
}

export default function ReportsPage() {
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
      const res = await fetch('/api/admin/stats')
      if (res.ok) setStats(await res.json())
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
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Platform analytics and completion data</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? 0 },
            { label: 'Modules', value: stats?.totalModules ?? 0 },
            { label: 'Completions', value: stats?.totalCompletions ?? 0 },
            { label: 'Completion Rate', value: (stats?.completionRate ?? 0).toFixed(1) + '%' },
          ].map(c => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{c.label}</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">{c.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Module Completion Rates</h2>
          {!stats?.moduleStats.length ? <p className="text-sm text-slate-400">No data.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase">{['Module','Completions','Avg Score'].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>
                {stats.moduleStats.map(m => (
                  <tr key={m.moduleId} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4 text-slate-700">{m.title}</td>
                    <td className="py-2.5 pr-4 text-blue-600 font-semibold">{m.completions}</td>
                    <td className="py-2.5 text-emerald-600">{m.avgScore != null ? Math.round(m.avgScore * 100) + '%' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Completions</h2>
          {!stats?.recentCompletions.length ? <p className="text-sm text-slate-400">No completions yet.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase">{['User','Module','Score','Date'].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>
                {stats.recentCompletions.map((c, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4 text-slate-700">{c.userName}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{c.moduleName}</td>
                    <td className="py-2.5 pr-4 text-emerald-600">{c.score != null ? Math.round(c.score * 100) + '%' : '-'}</td>
                    <td className="py-2.5 text-slate-400 text-xs">{new Date(c.completedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PlatformLayout>
  )
}
