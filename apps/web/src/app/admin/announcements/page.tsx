'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Announcement { id: string; title: string; body: string; type: string; isPinned: boolean; createdAt: string }
type AType = 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT'

const TYPE_COLORS: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-700', WARNING: 'bg-amber-100 text-amber-700',
  SUCCESS: 'bg-emerald-100 text-emerald-700', URGENT: 'bg-red-100 text-red-700',
}

export default function AnnouncementsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', type: 'INFO' as AType, isPinned: false })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/admin/announcements')
      if (res.ok) { const d = await res.json(); setAnnouncements(d.announcements ?? []) }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/admin/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { const d = await res.json(); setAnnouncements(prev => [d.announcement, ...prev]); setShowModal(false); setForm({ title: '', body: '', type: 'INFO', isPinned: false }) }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await fetch('/api/admin/announcements/' + id, { method: 'DELETE' })
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
            <p className="text-slate-500 text-sm mt-1">Post updates and alerts to users</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">+ New Announcement</button>
        </div>
        <div className="space-y-3">
          {announcements.length === 0 && <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">No announcements yet.</div>}
          {announcements.map(a => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (TYPE_COLORS[a.type] ?? 'bg-slate-100 text-slate-600')}>{a.type}</span>
                    {a.isPinned && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Pinned</span>}
                  </div>
                  <h3 className="font-semibold text-slate-800">{a.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{a.body}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-slate-300 hover:text-red-500 transition-colors text-sm flex-shrink-0">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-bold text-slate-800">New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
                <textarea required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as AType }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="INFO">Info</option><option value="WARNING">Warning</option><option value="SUCCESS">Success</option><option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} />
                    Pin announcement
                  </label>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Posting...' : 'Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PlatformLayout>
  )
}
