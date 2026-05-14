'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface LiveSession {
  id: string
  title: string
  description?: string
  scheduledAt: string
  durationMin: number
  joinUrl?: string
  host?: { name: string }
  org?: { name: string } | null
}

export default function AdminLiveSessionsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editSession, setEditSession] = useState<LiveSession | null>(null)
  const [form, setForm] = useState({ title: '', description: '', scheduledAt: '', durationMin: 60, joinUrl: '', orgId: '' })
  const [saving, setSaving] = useState(false)
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const [sessRes, orgRes] = await Promise.all([
        fetch('/api/admin/live-sessions'),
        fetch('/api/admin/organizations'),
      ])
      if (sessRes.ok) { const d = await sessRes.json(); setSessions(d.sessions ?? []) }
      if (orgRes.ok) { const d = await orgRes.json(); setOrgs(d.organizations ?? []) }
      setLoading(false)
    }
    load()
  }, [router])

  function openNew() {
    setEditSession(null)
    setForm({ title: '', description: '', scheduledAt: '', durationMin: 60, joinUrl: '', orgId: '' })
    setShowModal(true)
  }

  function openEdit(s: LiveSession) {
    setEditSession(s)
    const dt = new Date(s.scheduledAt)
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setForm({ title: s.title, description: s.description ?? '', scheduledAt: local, durationMin: s.durationMin, joinUrl: s.joinUrl ?? '', orgId: '' })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.title || !form.scheduledAt) return
    setSaving(true)
    const body = { ...form, durationMin: Number(form.durationMin), orgId: form.orgId || undefined }
    let res: Response
    if (editSession) {
      res = await fetch(`/api/admin/live-sessions/${editSession.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      res = await fetch('/api/admin/live-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    if (res.ok) {
      const d = await res.json()
      if (editSession) {
        setSessions(prev => prev.map(s => s.id === editSession.id ? d.session : s))
      } else {
        setSessions(prev => [...prev, d.session])
      }
      setShowModal(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this session?')) return
    const res = await fetch(`/api/admin/live-sessions/${id}`, { method: 'DELETE' })
    if (res.ok) setSessions(prev => prev.filter(s => s.id !== id))
  }

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>

  const now = new Date()
  const upcoming = sessions.filter(s => new Date(s.scheduledAt) >= now)
  const past = sessions.filter(s => new Date(s.scheduledAt) < now)

  return (
    <PlatformLayout user={user}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
            <p className="text-sm text-gray-500 mt-1">Schedule and manage live training sessions</p>
          </div>
          <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            + Schedule Session
          </button>
        </div>

        {/* Upcoming */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-400 mb-6">No upcoming sessions scheduled.</div>
        ) : (
          <div className="space-y-3 mb-8">
            {upcoming.map(s => (
              <SessionCard key={s.id} session={s} onEdit={() => openEdit(s)} onDelete={() => handleDelete(s.id)} upcoming />
            ))}
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Past Sessions ({past.length})</h2>
            <div className="space-y-3">
              {past.map(s => (
                <SessionCard key={s.id} session={s} onEdit={() => openEdit(s)} onDelete={() => handleDelete(s.id)} upcoming={false} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">{editSession ? 'Edit Session' : 'Schedule New Session'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Session title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Optional description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
                  <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" value={form.durationMin} onChange={e => setForm(f => ({ ...f, durationMin: Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" min={15} step={15} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join URL</label>
                <input value={form.joinUrl} onChange={e => setForm(f => ({ ...f, joinUrl: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://zoom.us/j/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization (optional)</label>
                <select value={form.orgId} onChange={e => setForm(f => ({ ...f, orgId: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">All organizations</option>
                  {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.scheduledAt} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {saving ? 'Saving…' : editSession ? 'Save Changes' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformLayout>
  )
}

function SessionCard({ session, onEdit, onDelete, upcoming }: { session: LiveSession; onEdit: () => void; onDelete: () => void; upcoming: boolean }) {
  const dt = new Date(session.scheduledAt)
  const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className={`bg-white rounded-lg border p-4 flex items-start justify-between gap-4 ${upcoming ? 'border-indigo-200' : 'border-gray-200 opacity-75'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${upcoming ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
            {upcoming ? 'Upcoming' : 'Past'}
          </span>
          {session.org && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{session.org.name}</span>}
        </div>
        <h3 className="font-semibold text-gray-900 truncate">{session.title}</h3>
        {session.description && <p className="text-sm text-gray-500 mt-0.5 truncate">{session.description}</p>}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>📅 {dateStr} at {timeStr}</span>
          <span>⏱ {session.durationMin} min</span>
          {session.host && <span>👤 {session.host.name}</span>}
        </div>
        {session.joinUrl && upcoming && (
          <a href={session.joinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-600 hover:underline">
            🔗 Join Link
          </a>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={onEdit} className="text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1">Edit</button>
        <button onClick={onDelete} className="text-sm text-red-500 hover:text-red-700 px-2 py-1">Delete</button>
      </div>
    </div>
  )
}
