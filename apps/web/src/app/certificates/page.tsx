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
