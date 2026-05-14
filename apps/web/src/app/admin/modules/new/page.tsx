'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ModuleCategory } from '@/lib/types/database'

const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']

export default function NewModulePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [categories, setCategories] = useState<ModuleCategory[]>([])
  const [form, setForm] = useState({
    title: '', description: '', category_id: '', content: '', video_url: '',
    duration_minutes: '', facilitator_name: '', is_required: false, is_published: false, sort_order: '0',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
      const { data: cats } = await supabase.from('module_categories').select('*').order('name')
      setCategories((cats as ModuleCategory[]) ?? [])
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('training_modules').insert({
      title: form.title,
      description: form.description || null,
      category_id: form.category_id || null,
      content: form.content || null,
      video_url: form.video_url || null,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      facilitator_name: form.facilitator_name || null,
      is_required: form.is_required,
      is_published: form.is_published,
      sort_order: parseInt(form.sort_order) || 0,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/modules')
    }
    setSaving(false)
  }

  const set = (k: string, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <PlatformLayout profile={profile}>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <a href="/admin/modules" className="text-sm text-slate-500 hover:text-blue-600">← Back</a>
          <h1 className="text-xl font-bold text-slate-800">New Training Module</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">No category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (minutes)</label>
                <input type="number" min="1" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Video URL (embed)</label>
              <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://…" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Content</label>
              <textarea rows={6} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Module content, notes, or instructions…" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Facilitator Name</label>
              <input value={form.facilitator_name} onChange={e => set('facilitator_name', e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_required} onChange={e => set('is_required', e.target.checked)} className="rounded" />
                Required module
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="rounded" />
                Published
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <a href="/admin/modules" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</a>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-colors">
                {saving ? 'Creating…' : 'Create Module'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PlatformLayout>
  )
}
