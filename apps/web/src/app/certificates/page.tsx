'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Certificate, TrainingModule } from '@/lib/types/database'

interface CertificateWithModule extends Certificate {
  training_modules: Pick<TrainingModule, 'title' | 'description'> | null
}

export default function CertificatesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [certificates, setCertificates] = useState<CertificateWithModule[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const [profileRes, certRes] = await Promise.all([
        supabase.from('profiles').select('*, organizations(name)').eq('id', user.id).single(),
        supabase
          .from('certificates')
          .select('*, training_modules(title, description)')
          .eq('user_id', user.id)
          .order('issued_at', { ascending: false }),
      ])

      setProfile(profileRes.data as Profile | null)
      setCertificates((certRes.data as CertificateWithModule[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handlePrint = (cert: CertificateWithModule) => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.training_modules?.title}</title>
        <style>
          body { font-family: Georgia, serif; text-align: center; padding: 60px; }
          .border { border: 8px double #1e3a5f; padding: 50px; display: inline-block; min-width: 600px; }
          h1 { color: #1e3a5f; font-size: 36px; margin-bottom: 8px; }
          .subtitle { color: #666; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 40px; }
          .name { font-size: 28px; color: #333; border-bottom: 2px solid #ccc; display: inline-block; padding: 0 40px 8px; margin: 20px 0; }
          .module { font-size: 20px; color: #1e3a5f; font-weight: bold; margin: 16px 0; }
          .date { color: #666; font-size: 14px; margin-top: 30px; }
          .org { color: #f97316; font-size: 16px; font-weight: bold; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="border">
          <h1>Certificate of Completion</h1>
          <div class="subtitle">Beyond The Surface Leadership Institute™</div>
          <p>This certifies that</p>
          <div class="name">${profile?.full_name ?? profile?.email}</div>
          <p>has successfully completed</p>
          <div class="module">${cert.training_modules?.title ?? 'Training Module'}</div>
          <div class="date">Issued on ${new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div class="org">BTSLI™ Certified</div>
          <div class="date" style="font-size:11px; color:#aaa; margin-top:16px;">Certificate #${cert.certificate_number}</div>
        </div>
      </body>
      </html>
    `)
    win.document.close()
    win.print()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <PlatformLayout profile={profile}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Certificates</h1>
          <p className="text-slate-500 text-sm mt-1">Certificates earned by completing training modules</p>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No certificates yet</h2>
            <p className="text-slate-400 text-sm mb-6">Complete a training module to earn your first certificate.</p>
            <a href="/dashboard" className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900">
              View Training Modules
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map(cert => (
              <div key={cert.id} className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-blue-300 transition-colors relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full" />

                <div className="text-3xl mb-3">🏅</div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2">
                  {cert.training_modules?.title ?? 'Training Module'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Issued {new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">#{cert.certificate_number}</span>
                  <button
                    onClick={() => handlePrint(cert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
