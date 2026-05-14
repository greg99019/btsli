'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Organization } from '@/lib/types/database'

const SUPER_ROLES = ['super_admin', 'consultant']

export default function AdminOrganizationsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', industry: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const profileRes = await supabase.from('profiles').select('*, organizations(name)').eq('id', user.id).single()
      const p = profileRes.data as Profile | null
      if (!p || !SUPER_ROLES.includes(p.role)) { router.replace('/admin'); return }
      setProfile(p)
      const { data } = await supabase.from('organizations').select('*').order('name')
      setOrgs((data as Organization[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data } = await supabase
      .from('organizations')
      .insert({ name: form.name, slug: form.slug, industry: form.industry || null, primary_color: '#3b82f6', subscription_tier: 'basic', is_active: true })
      .select()
      .single()
    if (data) setOrgs(prev => [...prev, data as Organization])
    setForm({ name: '', slug: '', industry: '' })
    setShowForm(false)
    setSaving(false)
  }

  const toggleActive = async (org: Organization) => {
    await supabase.from('organizations').update({ is_active: !org.is_active }).eq('id', org.id)
    setOrgs(prev => prev.map(o => o.id === org.id ? { ...o, is_active: !o.is_active } : o))
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Organizations</h1>
            <p className="text-slate-500 text-sm mt-1">{orgs.length} organizations</p>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-colors">
            + New Organization
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">New Organization</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Slug * (unique)</label>
                  <input required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. acme-corp" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Industry</label>
                <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Healthcare, Education, etc." />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-colors">
                  {saving ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {orgs.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No organizations yet.</div>
          ) : orgs.map(org => (
            <div key={org.id} className="p-4 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: org.primary_color + '20' }}
              >
                <span className="text-sm font-bold" style={{ color: org.primary_color }}>
                  {org.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{org.name}</p>
                <p className="text-xs text-slate-500">{org.slug} {org.industry ? `· ${org.industry}` : ''} · {org.subscription_tier}</p>
              </div>
              <button
                onClick={() => toggleActive(org)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  org.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-slate-100 hover:text-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                }`}
              >
                {org.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </PlatformLayout>
  )
}
