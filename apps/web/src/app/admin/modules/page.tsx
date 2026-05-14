'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TrainingModule } from '@/lib/types/database'

interface ModuleWithCategory extends TrainingModule {
  module_categories: { name: string } | null
}

const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']

export default function AdminModulesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [modules, setModules] = useState<ModuleWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
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
        .from('training_modules')
        .select('*, module_categories(name)')
        .order('sort_order')
      setModules((data as ModuleWithCategory[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await supabase.from('training_modules').delete().eq('id', id)
    setModules(prev => prev.filter(m => m.id !== id))
    setDeleting(null)
  }

  const togglePublish = async (m: ModuleWithCategory) => {
    await supabase.from('training_modules').update({ is_published: !m.is_published }).eq('id', m.id)
    setModules(prev => prev.map(mod => mod.id === m.id ? { ...mod, is_published: !mod.is_published } : mod))
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Training Modules</h1>
            <p className="text-slate-500 text-sm mt-1">{modules.length} modules total</p>
          </div>
          <Link href="/admin/modules/new" className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-colors">
            + New Module
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {modules.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No modules yet.</div>
          ) : modules.map(m => (
            <div key={m.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {m.module_categories && (
                    <span className="text-xs text-slate-500">{m.module_categories.name}</span>
                  )}
                  {m.is_required && <span className="text-xs text-red-500 font-medium">Required</span>}
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate">{m.title}</p>
                <p className="text-xs text-slate-400 truncate">{m.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => togglePublish(m)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    m.is_published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.is_published ? 'Published' : 'Draft'}
                </button>
                <Link href={`/admin/modules/${m.id}/edit`} className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(m.id, m.title)}
                  disabled={deleting === m.id}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === m.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlatformLayout>
  )
}
