'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Module {
  id: string; title: string; category: string; estimatedMinutes: number
  isPublished: boolean; isRequired: boolean; passingScore: number
  _count?: { progress: number; completions: number }
}

const CATEGORY_LABELS: Record<string, string> = {
  GETTING_STARTED: 'Getting Started', WORKPLACE_SYSTEMS: 'Workplace Systems',
  COMMUNICATION: 'Communication', LEADERSHIP: 'Leadership', SOPS: 'SOPs',
  ACCOUNTABILITY: 'Accountability', CUSTOMER_SERVICE: 'Customer Service',
  COMPLIANCE_SAFETY: 'Compliance & Safety', TEAM_COLLABORATION: 'Team Collaboration',
  PERFORMANCE_IMPROVEMENT: 'Performance',
}

const CAT_COLORS: Record<string, string> = {
  GETTING_STARTED: 'emerald', WORKPLACE_SYSTEMS: 'blue', COMMUNICATION: 'violet',
  LEADERSHIP: 'amber', SOPS: 'rose', ACCOUNTABILITY: 'orange',
  CUSTOMER_SERVICE: 'teal', COMPLIANCE_SAFETY: 'red', TEAM_COLLABORATION: 'indigo',
  PERFORMANCE_IMPROVEMENT: 'purple',
}

export default function AdminModules() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  async function loadModules() {
    const res = await fetch(`/api/admin/modules?search=${encodeURIComponent(search)}&limit=50`)
    if (res.ok) { const d = await res.json(); setModules(d.modules) }
  }

  useEffect(() => {
    async function init() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      if (!['SUPER_ADMIN','CONSULTANT','ORG_ADMIN','MANAGER'].includes(u.role)) { router.replace('/dashboard'); return }
      setCurrentUser(u); setLoading(false)
    }
    init()
  }, [router])

  useEffect(() => { if (currentUser) loadModules() }, [currentUser, search])

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/modules/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !current }) })
    loadModules()
  }

  async function handleDelete(id: string) {
    if (!confirm('Unpublish and archive this module?')) return
    await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' })
    loadModules()
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!currentUser) return null

  return (
    <PlatformLayout user={currentUser}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Training Modules</h1>
            <p className="text-slate-500 text-sm mt-0.5">{modules.length} modules</p>
          </div>
          <Link href="/admin/modules/new" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">+ New Module</Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl">
          <div className="p-4 border-b border-slate-100">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search modules..." className="w-full max-w-sm border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="divide-y divide-slate-50">
            {modules.map(m => {
              const color = CAT_COLORS[m.category] ?? 'blue'
              return (
                <div key={m.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">📚</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-800">{m.title}</span>
                      {m.isRequired && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Required</span>}
                      <span className={`bg-${color}-50 text-${color}-700 text-xs px-2 py-0.5 rounded-full`}>{CATEGORY_LABELS[m.category] ?? m.category}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.estimatedMinutes} min · {Math.round(m.passingScore * 100)}% passing · {m._count?.completions ?? 0} completions</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {m.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <button onClick={() => togglePublish(m.id, m.isPublished)} className="text-blue-600 hover:underline text-xs">
                      {m.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link href={`/admin/modules/${m.id}/edit`} className="text-slate-500 hover:text-slate-800 text-xs hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 text-xs hover:underline">Archive</button>
                  </div>
                </div>
              )
            })}
            {modules.length === 0 && (
              <div className="text-center py-12 text-slate-400">No modules yet. <Link href="/admin/modules/new" className="text-blue-600 hover:underline">Create one →</Link></div>
            )}
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
