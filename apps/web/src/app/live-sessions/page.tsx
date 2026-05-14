'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Session { id: string; title: string; description?: string; scheduledAt: string; durationMinutes?: number; meetingUrl?: string; hostName?: string }

export default function LiveSessionsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/admin/live-sessions')
      if (res.ok) { const d = await res.json(); setSessions((d.sessions ?? []).filter((s: Session) => new Date(s.scheduledAt) >= new Date())) }
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
          <h1 className="text-2xl font-bold text-slate-900">Live Sessions</h1>
          <p className="text-slate-500 text-sm mt-1">Upcoming live training sessions</p>
        </div>
        {sessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-lg font-semibold text-slate-700">No upcoming sessions</h2>
            <p className="text-slate-400 text-sm mt-2">Check back soon for scheduled sessions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{s.title}</h3>
                    {s.description && <p className="text-sm text-slate-500 mt-1">{s.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{new Date(s.scheduledAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      {s.durationMinutes && <span>{s.durationMinutes} min</span>}
                      {s.hostName && <span>Host: {s.hostName}</span>}
                    </div>
                  </div>
                  {s.meetingUrl && (
                    <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0">Join</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
