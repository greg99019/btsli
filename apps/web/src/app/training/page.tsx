'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Module {
  id: string; title: string; description: string; category: string
  estimatedMinutes: number; isRequired: boolean; passingScore: number
  thumbnailUrl?: string; progress?: { completed: boolean; watchedPct: number; quizScore?: number }
}

const CAT_LABELS: Record<string, string> = {
  GETTING_STARTED:'Getting Started',WORKPLACE_SYSTEMS:'Workplace Systems',COMMUNICATION:'Communication',
  LEADERSHIP:'Leadership',SOPS:'SOPs',ACCOUNTABILITY:'Accountability',CUSTOMER_SERVICE:'Customer Service',
  COMPLIANCE_SAFETY:'Compliance & Safety',TEAM_COLLABORATION:'Team Collaboration',
  PERFORMANCE_IMPROVEMENT:'Performance Improvement',
}
const CAT_COLORS: Record<string, string> = {
  GETTING_STARTED:'emerald',WORKPLACE_SYSTEMS:'blue',COMMUNICATION:'violet',LEADERSHIP:'amber',
  SOPS:'rose',ACCOUNTABILITY:'orange',CUSTOMER_SERVICE:'teal',COMPLIANCE_SAFETY:'red',
  TEAM_COLLABORATION:'indigo',PERFORMANCE_IMPROVEMENT:'purple',
}
const CAT_EMOJIS: Record<string, string> = {
  GETTING_STARTED:'🚀',WORKPLACE_SYSTEMS:'⚙️',COMMUNICATION:'💬',LEADERSHIP:'🌟',
  SOPS:'📋',ACCOUNTABILITY:'🎯',CUSTOMER_SERVICE:'🤝',COMPLIANCE_SAFETY:'🛡️',
  TEAM_COLLABORATION:'👥',PERFORMANCE_IMPROVEMENT:'📈',
}

export default function TrainingPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/training')
      if (res.ok) { const d = await res.json(); setModules(d.modules) }
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  const filtered = filter === 'all' ? modules
    : filter === 'completed' ? modules.filter(m => m.progress?.completed)
    : filter === 'in-progress' ? modules.filter(m => m.progress && !m.progress.completed && m.progress.watchedPct > 0)
    : modules.filter(m => !m.progress || m.progress.watchedPct === 0)

  const completedCount = modules.filter(m => m.progress?.completed).length
  const inProgressCount = modules.filter(m => m.progress && !m.progress.completed && m.progress.watchedPct > 0).length

  return (
    <PlatformLayout user={user}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Training</h1>
          <p className="text-slate-500 text-sm mt-0.5">{modules.length} modules available · {completedCount} completed</p>
        </div>

        {/* Progress summary */}
        {modules.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Completed', value: completedCount, color: 'emerald', filter: 'completed' },
              { label: 'In Progress', value: inProgressCount, color: 'blue', filter: 'in-progress' },
              { label: 'Not Started', value: modules.length - completedCount - inProgressCount, color: 'slate', filter: 'not-started' },
            ].map(s => (
              <button key={s.label} onClick={() => setFilter(s.filter === filter ? 'all' : s.filter)}
                className={`rounded-2xl p-4 text-left transition-all ${filter === s.filter ? `bg-${s.color}-600 text-white` : `bg-white border border-slate-200 hover:border-${s.color}-300`}`}>
                <div className={`text-2xl font-bold ${filter === s.filter ? 'text-white' : `text-${s.color}-700`}`}>{s.value}</div>
                <div className={`text-sm mt-0.5 ${filter === s.filter ? 'text-white/80' : 'text-slate-500'}`}>{s.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Module grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => {
            const color = CAT_COLORS[m.category] ?? 'blue'
            const emoji = CAT_EMOJIS[m.category] ?? '📚'
            const pct = Math.round((m.progress?.watchedPct ?? 0) * 100)
            const completed = m.progress?.completed ?? false
            return (
              <Link key={m.id} href={`/training/${m.id}`} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group">
                {m.thumbnailUrl ? (
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : (
                  <div className={`aspect-video bg-${color}-50 flex items-center justify-center`}>
                    <span className="text-5xl">{emoji}</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs bg-${color}-50 text-${color}-700 px-2 py-0.5 rounded-full font-medium`}>{CAT_LABELS[m.category] ?? m.category}</span>
                    {completed && <span className="text-emerald-600 text-lg">✅</span>}
                    {m.isRequired && !completed && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>}
                  </div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">{m.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>⏱ {m.estimatedMinutes} min</span>
                    {m.progress?.quizScore != null && <span className="text-emerald-600 font-medium">Score: {Math.round(m.progress.quizScore * 100)}%</span>}
                  </div>
                  {pct > 0 && !completed && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span><span>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{width:`${pct}%`}} />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-400">
              {modules.length === 0 ? 'No training modules available yet.' : 'No modules in this category.'}
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  )
}
