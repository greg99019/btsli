const fs = require('fs')
const path = require('path')

const content = `'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export type AuthUser = {
  id: string
  email: string
  role: string
  name?: string
  orgId?: string
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN', 'MANAGER']

interface NavItem { href: string; label: string; icon: React.ReactNode }

function Icon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
    </svg>
  )
}

const ICONS: Record<string, string> = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  training: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  certificate: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  live: 'M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  admin: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  modules: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  announcements: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  reports: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  orgs: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  livesession: 'M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
}

interface Props { user: AuthUser; children: React.ReactNode }

export default function PlatformLayout({ user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isAdmin = ADMIN_ROLES.includes(user.role)
  const isSuperOrConsultant = user.role === 'SUPER_ADMIN' || user.role === 'CONSULTANT'

  const mainNav: NavItem[] = [
    { href: '/dashboard',    label: 'Dashboard',      icon: <Icon d={ICONS.dashboard} /> },
    { href: '/training',     label: 'My Training',    icon: <Icon d={ICONS.training} /> },
    { href: '/certificates', label: 'Certificates',   icon: <Icon d={ICONS.certificate} /> },
    { href: '/live-sessions',label: 'Live Sessions',  icon: <Icon d={ICONS.live} /> },
  ]

  const adminNav: NavItem[] = [
    { href: '/admin',                 label: 'Admin Overview',   icon: <Icon d={ICONS.admin} /> },
    { href: '/admin/modules',         label: 'Training Modules', icon: <Icon d={ICONS.modules} /> },
    { href: '/admin/users',           label: 'Users',            icon: <Icon d={ICONS.users} /> },
    { href: '/admin/announcements',   label: 'Announcements',    icon: <Icon d={ICONS.announcements} /> },
    { href: '/admin/reports',         label: 'Reports',          icon: <Icon d={ICONS.reports} /> },
    ...(isSuperOrConsultant ? [{ href: '/admin/organizations', label: 'Organizations', icon: <Icon d={ICONS.orgs} /> }] : []),
    ...(isSuperOrConsultant ? [{ href: '/admin/live-sessions', label: 'Live Sessions', icon: <Icon d={ICONS.livesession} /> }] : []),
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : user.email[0].toUpperCase()

  const roleLabel: Record<string, string> = { SUPER_ADMIN: 'Super Admin', CONSULTANT: 'Consultant', ORG_ADMIN: 'Org Admin', MANAGER: 'Manager', PARTICIPANT: 'Participant' }

  function SidebarContent() {
    return (
      <nav className="flex flex-col h-full bg-slate-900 text-white w-64">
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">BT</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">BTSLI Training</p>
              <p className="text-xs text-slate-400 leading-tight">Platform</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {mainNav.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors " + (active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white')}>
                {item.icon}{item.label}
              </Link>
            )
          })}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Administration</p>
              </div>
              {adminNav.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors " + (active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white')}>
                    {item.icon}{item.label}
                  </Link>
                )
              })}
            </>
          )}
        </div>
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name ?? user.email}</p>
              <p className="text-xs text-slate-400 truncate">{roleLabel[user.role] ?? user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex lg:flex-shrink-0"><SidebarContent /></div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50"><SidebarContent /></div>
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-slate-800">BTSLI Training</span>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
`

const outPath = path.join(__dirname, 'src', 'components', 'layout', 'PlatformLayout.tsx')
fs.writeFileSync(outPath, content, 'utf8')
console.log('Written:', outPath)
