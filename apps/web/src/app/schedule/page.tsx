'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, LiveSession } from '@/lib/types/database'

interface SessionWithRSVP extends LiveSession {
  session_rsvps: { id: string; user_id: string }[]
}

export default function SchedulePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<SessionWithRSVP[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)

      const [profileRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('*, organizations(name)').eq('id', user.id).single(),
        supabase
          .from('live_sessions')
          .select('*, session_rsvps(id, user_id)')
          .order('scheduled_at'),
      ])

      setProfile(profileRes.data as Profile | null)
      setSessions((sessionsRes.data as SessionWithRSVP[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleRsvp = async (sessionId: string, hasRsvp: boolean) => {
    if (!userId) return
    setRsvpLoading(sessionId)

    if (hasRsvp) {
      await supabase
        .from('session_rsvps')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId)
    } else {
      await supabase
        .from('session_rsvps')
        .insert({ session_id: sessionId, user_id: userId, status: 'confirmed' })
    }

    const { data } = await supabase
      .from('live_sessions')
      .select('*, session_rsvps(id, user_id)')
      .order('scheduled_at')
    setSessions((data as SessionWithRSVP[]) ?? [])
    setRsvpLoading(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const now = new Date()
  const upcoming = sessions.filter(s => new Date(s.scheduled_at) >= now)
  const past = sessions.filter(s => new Date(s.scheduled_at) < now)

  const typeColors: Record<string, string> = {
    live: 'bg-blue-100 text-blue-700',
    workshop: 'bg-violet-100 text-violet-700',
    check_in: 'bg-emerald-100 text-emerald-700',
    webinar: 'bg-amber-100 text-amber-700',
  }

  function SessionCard({ s, isPast }: { s: SessionWithRSVP; isPast?: boolean }) {
    const hasRsvp = s.session_rsvps?.some(r => r.user_id === userId) ?? false
    const date = new Date(s.scheduled_at)
    const rsvpCount = s.session_rsvps?.length ?? 0

    return (
      <div id={s.id} className={`bg-white rounded-2xl border p-5 ${isPast ? 'border-slate-100 opacity-75' : 'border-slate-200 hover:border-blue-200 transition-colors'}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[s.session_type] ?? typeColors.live}`}>
                {s.session_type.replace('_', ' ')}
              </span>
              {isPast && <span className="text-xs text-slate-400">Past</span>}
            </div>
            <h3 className="text-sm font-bold text-slate-800">{s.title}</h3>
            {s.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</p>}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
              <span>📅 {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span>🕐 {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              {s.duration_minutes && <span>⏱ {s.duration_minutes} min</span>}
              {s.facilitator_name && <span>👤 {s.facilitator_name}</span>}
              <span>👥 {rsvpCount} RSVP{rsvpCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {!isPast && (
              <button
                onClick={() => handleRsvp(s.id, hasRsvp)}
                disabled={rsvpLoading === s.id}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 ${
                  hasRsvp
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {rsvpLoading === s.id ? '…' : hasRsvp ? '✓ Cancel RSVP' : 'RSVP'}
              </button>
            )}
            {s.meeting_url && (
              <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Join Meeting →
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Upcoming live sessions, workshops, and check-ins</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-700">Upcoming Sessions</h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="text-slate-400 text-sm">No upcoming sessions scheduled.</p>
            </div>
          ) : (
            upcoming.map(s => <SessionCard key={s.id} s={s} />)
          )}
        </div>
        {past.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-500">Past Sessions</h2>
            {past.map(s => <SessionCard key={s.id} s={s} isPast />)}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
