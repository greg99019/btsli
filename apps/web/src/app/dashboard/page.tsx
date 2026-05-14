'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TrainingModule, UserProgress, Announcement, LiveSession } from '@/lib/types/database'

interface ModuleWithProgress extends TrainingModule {
  module_categories: { name: string; color: string } | null
  user_progress: UserProgress[]
}

interface SessionWithRSVP extends LiveSession {
  session_rsvps: { id: string }[]
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [modules, setModules] = useState<ModuleWithProgress[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [sessions, setSessions] = useState<SessionWithRSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const [profileRes, modulesRes, announcementsRes, sessionsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, organizations(name, primary_color)')
          .eq('id', user.id)
          .single(),
        supabase
          .from('training_modules')
          .select('*, module_categories(name, color), user_progress!left(id, status, progress_percentage, completed_at)')
          .eq('is_published', true)
          .order('sort_order'),
        supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('live_sessions')
          .select('*, session_rsvps!left(id)')
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at')
          .limit(5),
      ])

      setProfile(profileRes.data as Profile | null)
      setModules((modulesRes.data as ModuleWithProgress[]) ?? [])
      setAnnouncements((announcementsRes.data as Announcement[]) ?? [])
      setSessions((sessionsRes.data as SessionWithRSVP[]) ?? [])
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredModules = modules.filter(m =>
    !search || m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.module_categories?.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalModules = modules.length
  const completedModules = modules.filter(m => m.user_progress?.[0]?.status === 'completed').length
  const inProgressModules = modules.filter(m => m.user_progress?.[0]?.status === 'in_progress').length
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  const getModuleStatus = (m: ModuleWithProgress) => {
    const p = m.user_progress?.[0]
    if (!p) return { label: 'Not Started', color: 'slate', pct: 0 }
    if (p.status === 'completed') return { label: 'Completed', color: 'emerald', pct: 100 }
    if (p.status === 'in_progress') return { label: 'In Progress', color: 'blue', pct: p.progress_percentage ?? 0 }
    return { label: 'Not Started', color: 'slate', pct: 0 }
  }

  const announcementColors: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    urgent: 'bg-red-50 border-red-200 text-red-800',
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-800 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-blue-200 text-sm">
            {completedModules} of {totalModules} modules complete — keep going!
          </p>
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 mt-1">{overallProgress}% overall completion</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Modules', value: totalModules, color: 'blue' },
            { label: 'Completed', value: completedModules, color: 'emerald' },
            { label: 'In Progress', value: inProgressModules, color: 'amber' },
            { label: 'Completion Rate', value: `${overallProgress}%`, color: 'violet' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Training modules (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Training Modules</h2>
              <input
                type="text"
                placeholder="Search modules…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>

            {filteredModules.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400 text-sm">No modules found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredModules.map(module => {
                  const status = getModuleStatus(module)
                  return (
                    <div key={module.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {module.module_categories && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                {module.module_categories.name}
                              </span>
                            )}
                            {module.is_required && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Required</span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-slate-800 leading-snug">{module.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{module.description}</p>
                          {status.pct > 0 && status.pct < 100 && (
                            <div className="mt-2 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${status.pct}%` }} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {status.label}
                          </span>
                          <Link
                            href={`/training/${module.id}`}
                            className="text-xs px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                          >
                            {status.label === 'Completed' ? 'Review' : status.label === 'In Progress' ? 'Continue' : 'Start'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right column: announcements + sessions */}
          <div className="space-y-6">
            {/* Announcements */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Announcements</h2>
              {announcements.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                  <p className="text-slate-400 text-xs">No announcements.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {announcements.map(a => (
                    <div key={a.id} className={`rounded-xl border p-3 text-sm ${announcementColors[a.type] ?? announcementColors.info}`}>
                      <p className="font-semibold text-xs mb-0.5">{a.title}</p>
                      <p className="text-xs opacity-80 line-clamp-2">{a.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming sessions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-800">Upcoming Sessions</h2>
                <Link href="/schedule" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
              </div>
              {sessions.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                  <p className="text-slate-400 text-xs">No upcoming sessions.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map(s => {
                    const date = new Date(s.scheduled_at)
                    const hasRsvp = (s.session_rsvps?.length ?? 0) > 0
                    return (
                      <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-3">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{s.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                          {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                        <div className="mt-2">
                          {hasRsvp ? (
                            <span className="text-xs text-emerald-600 font-medium">✓ RSVP'd</span>
                          ) : (
                            <Link
                              href={`/schedule#${s.id}`}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              RSVP →
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
