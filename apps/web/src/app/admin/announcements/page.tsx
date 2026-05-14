'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Announcement, AnnouncementType } from '@/lib/types/database'

const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']

export default function AdminAnnouncementsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', content: '', type: 'info' as AnnouncementType })
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const profileRes = await supabase.from('profiles').select('*, organizations(name, id)').eq('id', user.id).single()
      const p = profileRes.data as Profile | null
      if (!p || !ADMIN_ROLES.includes(p.role)) { router.replace('/dashboard'); return }
      setProfile(p)
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
      setAnnouncements((data as Announcement[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (editing) {
      const { data } = await supabase
        .from('announcements')
        .update({ title: form.title, content: form.content, type: form.type })
        .eq('id', editing.id)
        .select()
        .single()
      setAnnouncements(prev => prev.map(a => a.id === editing.id ? data as Announcement : a))
    } else {
      const { data } = await supabase
        .from('announcements')
        .insert({
          title: form.title,
          content: form.content,
          type: form.type,
          organization_id: profile?.organization_id ?? null,
          is_visible: true,
          created_by: profile?.id,
        })
        .select()
        .single()
      setAnnouncements(prev => [data as Announcement, ...prev])
    }

    setForm({ title: '', content: '', type: 'info' })
    setEditing(null)
    setShowForm(false)
    setSaving(false)
  }

  const handleEdit = (a: Announcement) => {
    setEditing(a)
    setForm({ title: a.title, content: a.content, type: a.type })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await supabase.from('announcements').delete().eq('id', id)
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  const toggleActive = async (a: Announcement) => {
    await supabase.from('announcements').update({ is_visible: !a.is_visible }).eq('id', a.id)
    setAnnouncements(prev => prev.map(ann => ann.id === a.id ? { ...ann, is_visible: !ann.is_visible, is_active: !ann.is_active } : ann))
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  const typeColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700', warning: 'bg-amber-100 text-amber-700',
    success: 'bg-emerald-100 text-emerald-700', urgent: 'bg-red-100 text-red-700',
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
            <p className="text-slate-500 text-sm mt-1">{announcements.length} total</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', content: '', type: 'info' }) }}
            className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-colors"
          >
            + New Announcement
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content *</label>
                <textarea required rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as AnnouncementType }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-colors">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {announcements.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No announcements yet.</div>
          ) : announcements.map(a => (
            <div key={a.id} className="p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[a.type]}`}>{a.type}</span>
                  {!a.is_visible && <span className="text-xs text-slate-400">Hidden</span>}
                </div>
                <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{a.content}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(a)} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${a.is_visible ? 'bg-emerald-100 text-emerald-700 hover:bg-slate-100 hover:text-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'}`}>
                  {a.is_visible ? 'Visible' : 'Hidden'}
                </button>
                <button onClick={() => handleEdit(a)} className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlatformLayout>
  )
}
