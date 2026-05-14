'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface DashData {
  moduleStats: { total: number; completed: number; inProgress: number; notStarted: number }
  announcements: { id: string; title: string; body: string; type: string; pinned: boolean; createdAt: string }[]
  upcomingSessions: { id: string; title: string; scheduledAt: string; durationMin: number; joinUrl?: string }[]
  unreadNotifications: number
  recentProgress: { moduleId: string; module: { title: string }; watchedPct: number; completed: boolean; completedAt?: string }[]
}

const TYPE_STYLES: Record<string, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  alert: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
}

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/dashboard')
      if (res.ok) setData(await res.json())
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  const isAdmin = ['SUPER_ADMIN','CONSULTANT','ORG_ADMIN','MANAGER'].includes(user.role)
  const stats = data?.moduleStats

  return (
    <PlatformLayout user={user}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl p-6">
          <h1 className="text-2xl font-bold">Welcome back, {user.name?.split(' ')[0] ?? 'there'}! 👋</h1>
          <p className="text-blue-100 mt-1 text-sm">
            {isAdmin ? 'Manage your platform and support your team.' : 'Continue your workplace training journey.'}
          </p>
          {data?.unreadNotifications != null && data.unreadNotifications > 0 && (
            <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 inline-flex items-center gap-2 text-sm">
              🔔 You have {data.unreadNotifications} unread notification{data.unreadNotifications > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Total Modules', value:stats.total, icon:'📚', href:'/training', color:'blue' },
              { label:'Completed', value:stats.completed, icon:'✅', href:'/training?filter=completed', color:'emerald' },
              { label:'In Progress', value:stats.inProgress, icon:'▶️', href:'/training?filter=in-progress', color:'amber' },
              { label:'Not Started', value:stats.notStarted, icon:'⏳', href:'/training?filter=not-started', color:'slate' },
            ].map(s => (
              <Link key={s.label} href={s.href} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm hover:border-blue-200 transition-all">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent training progress */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Recent Training</h2>
              <Link href="/training" className="text-sm text-blue-600 hover:underline">View all →</Link>
            </div>
            {data?.recentProgress?.length ? (
              <div className="space-y-3">
                {data.recentProgress.map(p => (
                  <Link key={p.moduleId} href={`/training/${p.moduleId}`} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all block">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.completed ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      <span>{p.completed ? '✅' : '▶️'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">{p.module.title}</div>
                      {p.completed ? (
                        <div className="text-xs text-emerald-600 mt-0.5">Completed {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : ''}</div>
                      ) : (
                        <div className="mt-1.5">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress</span><span>{Math.round(p.watchedPct*100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{width:`${Math.round(p.watchedPct*100)}%`}} />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-slate-500 text-sm">No training started yet.</p>
                <Link href="/training" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Browse training modules →</Link>
              </div>
            )}

            {/* Upcoming sessions */}
            {data?.upcomingSessions?.length ? (
              <div className="space-y-3">
                <h2 className="font-semibold text-slate-800">Upcoming Live Sessions</h2>
                {data.upcomingSessions.map(s => (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-800">{s.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        📅 {new Date(s.scheduledAt).toLocaleDateString()} at {new Date(s.scheduledAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · {s.durationMin} min
                      </div>
                    </div>
                    {s.joinUrl && (
                      <a href={s.joinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex-shrink-0">Join →</a>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Announcements + quick actions */}
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-800">Announcements</h2>
            {data?.announcements?.length ? (
              <div className="space-y-3">
                {data.announcements.map(a => (
                  <div key={a.id} className={`border rounded-2xl p-4 ${TYPE_STYLES[a.type] ?? TYPE_STYLES.info}`}>
                    {a.pinned && <div className="text-xs font-medium mb-1">📌 Pinned</div>}
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-xs mt-1 line-clamp-3">{a.body}</div>
                    <div className="text-xs opacity-60 mt-2">{new Date(a.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center text-slate-400 text-sm">No announcements.</div>
            )}

            {/* Quick actions */}
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-800">Quick Links</h2>
              {[
                { href:'/training', label:'Browse Training', icon:'📚' },
                { href:'/certificates', label:'My Certificates', icon:'🏅' },
                { href:'/schedule', label:'Live Sessions', icon:'🎥' },
                ...(isAdmin ? [{ href:'/admin', label:'Admin Dashboard', icon:'⚙️' }] : []),
              ].map(l => (
                <Link key={l.href} href={l.href} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50 transition-all block">
                  <span className="text-lg">{l.icon}</span>
                  <span className="text-sm text-slate-700 font-medium">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
