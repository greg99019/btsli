'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TrainingModule, UserProgress } from '@/lib/types/database'

interface ProgressWithModule extends UserProgress {
  training_modules: Pick<TrainingModule, 'id' | 'title' | 'description' | 'duration_minutes' | 'is_required'> & {
    module_categories: { name: string } | null
  }
}

export default function ProgressPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [progressList, setProgressList] = useState<ProgressWithModule[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const [profileRes, progressRes] = await Promise.all([
        supabase.from('profiles').select('*, organizations(name)').eq('id', user.id).single(),
        supabase
          .from('user_progress')
          .select('*, training_modules(id, title, description, duration_minutes, is_required, module_categories(name))')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
      ])

      setProfile(profileRes.data as Profile | null)
      setProgressList((progressRes.data as ProgressWithModule[]) ?? [])
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

  const completed = progressList.filter(p => p.status === 'completed')
  const inProgress = progressList.filter(p => p.status === 'in_progress')

  const statusConfig = {
    completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700' },
    not_started: { label: 'Not Started', bg: 'bg-slate-100', text: 'text-slate-600' },
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Progress</h1>
          <p className="text-slate-500 text-sm mt-1">Track your training history and completion status</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{completed.length}</p>
            <p className="text-xs text-slate-500 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{inProgress.length}</p>
            <p className="text-xs text-slate-500 mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-slate-700">{progressList.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Started</p>
          </div>
        </div>

        {/* Progress list */}
        {progressList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-400 mb-4">You haven't started any modules yet.</p>
            <Link href="/dashboard" className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {progressList.map(p => {
              const cfg = statusConfig[p.status as keyof typeof statusConfig] ?? statusConfig.not_started
              const pct = p.progress_percentage ?? 0
              return (
                <div key={p.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {p.training_modules?.module_categories && (
                        <span className="text-xs text-slate-500">{p.training_modules.module_categories.name}</span>
                      )}
                      {p.training_modules?.is_required && (
                        <span className="text-xs text-red-600 font-medium">Required</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{p.training_modules?.title ?? 'Unknown module'}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden max-w-48">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{pct}%</span>
                    </div>
                    {p.completed_at && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Completed {new Date(p.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    <Link
                      href={`/training/${p.training_modules?.id}`}
                      className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {p.status === 'completed' ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
