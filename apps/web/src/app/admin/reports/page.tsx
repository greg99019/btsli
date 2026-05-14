'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TrainingModule, UserProgress } from '@/lib/types/database'

const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']

interface ProgressRow {
  user_name: string
  user_email: string
  org_name: string
  module_title: string
  status: string
  progress_pct: number
  completed_at: string | null
}

export default function AdminReportsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
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

      const { data } = await supabase
        .from('user_progress')
        .select(`
          status,
          progress_percentage,
          completed_at,
          profiles:user_id(full_name, email, organizations(name)),
          training_modules:module_id(title)
        `)
        .order('completed_at', { ascending: false })

      const formatted: ProgressRow[] = ((data as any[]) ?? []).map((r: any) => ({
        user_name: r.profiles?.full_name ?? '—',
        user_email: r.profiles?.email ?? '—',
        org_name: r.profiles?.organizations?.name ?? '—',
        module_title: r.training_modules?.title ?? '—',
        status: r.status,
        progress_pct: r.progress_percentage ?? 0,
        completed_at: r.completed_at,
      }))

      setRows(formatted)
      setLoading(false)
    }
    load()
  }, [])

  const exportCSV = () => {
    setExporting(true)
    const headers = ['Name', 'Email', 'Organization', 'Module', 'Status', 'Progress %', 'Completed At']
    const csvRows = rows.map(r => [
      `"${r.user_name}"`,
      `"${r.user_email}"`,
      `"${r.org_name}"`,
      `"${r.module_title}"`,
      r.status,
      r.progress_pct,
      r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-US') : '',
    ].join(','))

    const csv = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `btsli-progress-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  const completed = rows.filter(r => r.status === 'completed').length
  const inProgress = rows.filter(r => r.status === 'in_progress').length
  const completionRate = rows.length > 0 ? Math.round((completed / rows.length) * 100) : 0

  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    not_started: 'bg-slate-100 text-slate-600',
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
            <p className="text-slate-500 text-sm mt-1">{rows.length} training records</p>
          </div>
          <button
            onClick={exportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{completed}</p>
            <p className="text-xs text-slate-500 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
            <p className="text-xs text-slate-500 mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-slate-700">{completionRate}%</p>
            <p className="text-xs text-slate-500 mt-1">Completion Rate</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Organization</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Module</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Progress</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No data yet.</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{r.user_name}</p>
                      <p className="text-xs text-slate-400">{r.user_email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.org_name}</td>
                    <td className="px-4 py-3 text-slate-700 text-xs max-w-xs truncate">{r.module_title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] ?? statusColors.not_started}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${r.progress_pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{r.progress_pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
