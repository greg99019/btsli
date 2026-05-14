const fs = require('fs')
const path = require('path')

const base = path.join(__dirname, 'src', 'app')

function write(relPath, content) {
  const p = path.join(base, relPath)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content.trimStart(), 'utf8')
  console.log('Wrote:', p)
}

// ==================== admin/page.tsx ====================
write('admin/page.tsx', `
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Stats {
  totalUsers: number; totalModules: number; totalCompletions: number
  completionRate: number
  recentCompletions: { userName: string; moduleName: string; completedAt: string; score?: number }[]
  moduleStats: { moduleId: string; title: string; completions: number; avgScore?: number }[]
}

export default function AdminPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) setStats(await statsRes.json())
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Platform overview and analytics</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? 0, color: 'blue' },
            { label: 'Modules', value: stats?.totalModules ?? 0, color: 'violet' },
            { label: 'Completions', value: stats?.totalCompletions ?? 0, color: 'emerald' },
            { label: 'Completion Rate', value: (stats?.completionRate ?? 0).toFixed(1) + '%', color: 'amber' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{card.label}</p>
              <p className={"text-3xl font-bold mt-1 text-" + card.color + "-600"}>{card.value}</p>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Recent Completions</h2>
            {stats?.recentCompletions.length === 0
              ? <p className="text-sm text-slate-400">No completions yet.</p>
              : <div className="space-y-3">
                  {(stats?.recentCompletions ?? []).map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.userName}</p>
                        <p className="text-xs text-slate-500">{c.moduleName}</p>
                      </div>
                      <div className="text-right">
                        {c.score != null && <p className="text-sm font-semibold text-emerald-600">{Math.round(c.score * 100)}%</p>}
                        <p className="text-xs text-slate-400">{new Date(c.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Module Performance</h2>
            {stats?.moduleStats.length === 0
              ? <p className="text-sm text-slate-400">No data yet.</p>
              : <div className="space-y-3">
                  {(stats?.moduleStats ?? []).map(m => (
                    <div key={m.moduleId} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <p className="text-sm text-slate-700 truncate flex-1 mr-4">{m.title}</p>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-blue-600">{m.completions} completions</p>
                        {m.avgScore != null && <p className="text-xs text-slate-400">Avg: {Math.round(m.avgScore * 100)}%</p>}
                      </div>
                    </div>
                  ))}
                </div>}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/admin/modules/new', label: 'New Module' },
              { href: '/admin/users', label: 'Manage Users' },
              { href: '/admin/announcements', label: 'Post Announcement' },
              { href: '/admin/reports', label: 'View Reports' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">{a.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
`)

// ==================== admin/announcements/page.tsx ====================
write('admin/announcements/page.tsx', `
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
`)

// ==================== admin/organizations/page.tsx ====================
write('admin/organizations/page.tsx', `
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
`)

// ==================== admin/reports/page.tsx ====================
write('admin/reports/page.tsx', `
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Stats {
  totalUsers: number; totalModules: number; totalCompletions: number; completionRate: number
  recentCompletions: { userName: string; moduleName: string; completedAt: string; score?: number }[]
  moduleStats: { moduleId: string; title: string; completions: number; avgScore?: number }[]
}

export default function ReportsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/admin/stats')
      if (res.ok) setStats(await res.json())
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Platform analytics and completion data</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? 0 },
            { label: 'Modules', value: stats?.totalModules ?? 0 },
            { label: 'Completions', value: stats?.totalCompletions ?? 0 },
            { label: 'Completion Rate', value: (stats?.completionRate ?? 0).toFixed(1) + '%' },
          ].map(c => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{c.label}</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">{c.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Module Completion Rates</h2>
          {!stats?.moduleStats.length ? <p className="text-sm text-slate-400">No data.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase">{['Module','Completions','Avg Score'].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>
                {stats.moduleStats.map(m => (
                  <tr key={m.moduleId} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4 text-slate-700">{m.title}</td>
                    <td className="py-2.5 pr-4 text-blue-600 font-semibold">{m.completions}</td>
                    <td className="py-2.5 text-emerald-600">{m.avgScore != null ? Math.round(m.avgScore * 100) + '%' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Completions</h2>
          {!stats?.recentCompletions.length ? <p className="text-sm text-slate-400">No completions yet.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase">{['User','Module','Score','Date'].map(h => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>
                {stats.recentCompletions.map((c, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-4 text-slate-700">{c.userName}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{c.moduleName}</td>
                    <td className="py-2.5 pr-4 text-emerald-600">{c.score != null ? Math.round(c.score * 100) + '%' : '-'}</td>
                    <td className="py-2.5 text-slate-400 text-xs">{new Date(c.completedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PlatformLayout>
  )
}
`)

// ==================== certificates/page.tsx ====================
write('certificates/page.tsx', `
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Certificate {
  id: string; certId: string; issuedAt: string; quizScore?: number
  module: { title: string; description: string; category: string }
}

export default function CertificatesPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/training/certificates')
      if (res.ok) { const d = await res.json(); setCerts(d.certificates ?? []) }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-slate-500 text-sm mt-1">Training completions and earned credentials</p>
        </div>
        {certs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🏅</div>
            <h2 className="text-lg font-semibold text-slate-700">No certificates yet</h2>
            <p className="text-slate-400 text-sm mt-2">Complete training modules to earn certificates.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map(c => (
              <div key={c.id} className="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-4 border-b border-amber-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Certificate of Completion</span>
                    <span className="text-2xl">🏅</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{c.module.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{c.module.description}</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c.module.category}</span>
                    </div>
                    {c.quizScore != null && <p>Score: <span className="text-emerald-600 font-semibold">{Math.round(c.quizScore * 100)}%</span></p>}
                    <p>Issued: {new Date(c.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-300 font-mono truncate">ID: {c.certId}</p>
                    <p className="text-xs text-slate-300 mt-0.5">BTSLI Training Platform</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
`)

// ==================== schedule/page.tsx → live-sessions redirect ====================
write('schedule/page.tsx', `
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SchedulePage() {
  const router = useRouter()
  useEffect(() => { router.replace('/live-sessions') }, [router])
  return null
}
`)

// ==================== live-sessions/page.tsx ====================
write('live-sessions/page.tsx', `
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface Session { id: string; title: string; description?: string; scheduledAt: string; durationMinutes?: number; meetingUrl?: string; hostName?: string }

export default function LiveSessionsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/admin/live-sessions')
      if (res.ok) { const d = await res.json(); setSessions((d.sessions ?? []).filter((s: Session) => new Date(s.scheduledAt) >= new Date())) }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Sessions</h1>
          <p className="text-slate-500 text-sm mt-1">Upcoming live training sessions</p>
        </div>
        {sessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-lg font-semibold text-slate-700">No upcoming sessions</h2>
            <p className="text-slate-400 text-sm mt-2">Check back soon for scheduled sessions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{s.title}</h3>
                    {s.description && <p className="text-sm text-slate-500 mt-1">{s.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{new Date(s.scheduledAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      {s.durationMinutes && <span>{s.durationMinutes} min</span>}
                      {s.hostName && <span>Host: {s.hostName}</span>}
                    </div>
                  </div>
                  {s.meetingUrl && (
                    <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0">Join</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
`)

// ==================== progress/page.tsx → redirect to training ====================
write('progress/page.tsx', `
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProgressPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/training') }, [router])
  return null
}
`)

console.log('All pages written successfully!')
