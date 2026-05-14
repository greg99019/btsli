'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Org { id: string; name: string; slug: string; isActive: boolean; _count?: { users: number } }

export default function OrgsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [orgs, setOrgs] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Org | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', logoUrl: '', primaryColor: '#2563eb', maxUsers: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/admin/organizations')
      if (res.ok) { const d = await res.json(); setOrgs(d.organizations ?? []) }
      setLoading(false)
    }
    load()
  }, [router])

  function openNew() { setEditing(null); setForm({ name: '', slug: '', logoUrl: '', primaryColor: '#2563eb', maxUsers: '' }); setShowModal(true) }
  function openEdit(org: Org) { setEditing(org); setForm({ name: org.name, slug: org.slug, logoUrl: '', primaryColor: '#2563eb', maxUsers: '' }); setShowModal(true) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    if (editing) {
      const res = await fetch('/api/admin/organizations/' + editing.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { const d = await res.json(); setOrgs(prev => prev.map(o => o.id === editing.id ? d.organization : o)); setShowModal(false) }
    } else {
      const res = await fetch('/api/admin/organizations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { const d = await res.json(); setOrgs(prev => [...prev, d.organization]); setShowModal(false) }
    }
    setSaving(false)
  }

  async function toggleActive(org: Org) {
    const res = await fetch('/api/admin/organizations/' + org.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !org.isActive }) })
    if (res.ok) { const d = await res.json(); setOrgs(prev => prev.map(o => o.id === org.id ? d.organization : o)) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
            <p className="text-slate-500 text-sm mt-1">Manage client organizations</p>
          </div>
          <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">+ New Organization</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map(org => (
            <div key={org.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{org.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">/{org.slug}</p>
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (org.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{org.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              {org._count && <p className="text-sm text-slate-500">{org._count.users} users</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(org)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                <button onClick={() => toggleActive(org)} className="text-xs text-slate-400 hover:text-slate-600 font-medium">{org.isActive ? 'Deactivate' : 'Activate'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Organization' : 'New Organization'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="my-org" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PlatformLayout>
  )
}
