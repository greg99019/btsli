'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/lib/types/database'

interface UserWithOrg extends Profile {
  organizations: { name: string } | null
}

const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']
const ALL_ROLES: UserRole[] = ['super_admin', 'consultant', 'org_admin', 'manager', 'participant']

export default function AdminUsersPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [users, setUsers] = useState<UserWithOrg[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
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
        .from('profiles')
        .select('*, organizations(name)')
        .order('full_name')
      setUsers((data as UserWithOrg[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const updateRole = async (userId: string, role: UserRole) => {
    setUpdating(userId)
    await supabase.from('profiles').update({ role }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    setUpdating(null)
  }

  const toggleActive = async (u: UserWithOrg) => {
    setUpdating(u.id)
    await supabase.from('profiles').update({ is_active: !u.is_active }).eq('id', u.id)
    setUsers(prev => prev.map(user => user.id === u.id ? { ...user, is_active: !user.is_active } : user))
    setUpdating(null)
  }

  const filtered = users.filter(u =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.organizations?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin', consultant: 'Consultant',
    org_admin: 'Org Admin', manager: 'Manager', participant: 'Participant',
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Users</h1>
            <p className="text-slate-500 text-sm mt-1">{users.length} users total</p>
          </div>
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Organization</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No users found.</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{u.full_name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{u.organizations?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value as UserRole)}
                        disabled={updating === u.id}
                        className="text-xs px-2 py-1 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {ALL_ROLES.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(u)}
                        disabled={updating === u.id}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                          u.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-emerald-100 hover:text-emerald-700'
                        } disabled:opacity-50`}
                      >
                        {updating === u.id ? '…' : u.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
}
