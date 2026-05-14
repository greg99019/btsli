'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

interface User {
  id: string; name: string; email: string; role: string; isActive: boolean
  jobTitle?: string; department?: string; orgId?: string
  organization?: { name: string }; createdAt: string
}

const ROLES = ['SUPER_ADMIN','CONSULTANT','ORG_ADMIN','MANAGER','PARTICIPANT','CLIENT','COACH']

export default function AdminUsers() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'PARTICIPANT', jobTitle:'', department:'' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function loadUsers() {
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&limit=50`)
    if (res.ok) { const d = await res.json(); setUsers(d.users) }
  }

  useEffect(() => {
    async function init() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      if (!['SUPER_ADMIN','CONSULTANT','ORG_ADMIN','MANAGER'].includes(u.role)) { router.replace('/dashboard'); return }
      setCurrentUser(u)
      setLoading(false)
    }
    init()
  }, [router])

  useEffect(() => { if (currentUser) loadUsers() }, [currentUser, search])

  function openCreate() { setEditUser(null); setForm({ name:'', email:'', password:'', role:'PARTICIPANT', jobTitle:'', department:'' }); setError(''); setShowModal(true) }
  function openEdit(u: User) {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, password:'', role: u.role, jobTitle: u.jobTitle??'', department: u.department??'' })
    setError(''); setShowModal(true)
  }

  async function handleSave() {
    setSaving(true); setError('')
    try {
      const url = editUser ? `/api/admin/users/${editUser.id}` : '/api/admin/users'
      const method = editUser ? 'PATCH' : 'POST'
      const body: Record<string, string> = { name: form.name, email: form.email, role: form.role, jobTitle: form.jobTitle, department: form.department }
      if (form.password) body.password = form.password
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return }
      setShowModal(false); loadUsers()
    } finally { setSaving(false) }
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Deactivate this user?')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    loadUsers()
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!currentUser) return null

  return (
    <PlatformLayout user={currentUser}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-slate-500 text-sm mt-0.5">{users.length} users found</p>
          </div>
          <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">+ Add User</button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl">
          <div className="p-4 border-b border-slate-100">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full max-w-sm border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-slate-500 font-medium">Name</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Email</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Role</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Organization</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Status</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">{u.name[0]}</div>
                        <span className="font-medium text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{u.role}</span></td>
                    <td className="px-4 py-3 text-slate-500">{u.organization?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline text-xs">Edit</button>
                        {u.isActive && <button onClick={() => handleDeactivate(u.id)} className="text-red-500 hover:underline text-xs">Deactivate</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="p-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">{editUser ? 'Edit User' : 'Add User'}</h2>
              </div>
              <div className="p-5 space-y-3">
                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" type="email" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder={editUser ? 'New password (leave blank to keep)' : 'Password'} type="password" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} placeholder="Job Title (optional)" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Department (optional)" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
