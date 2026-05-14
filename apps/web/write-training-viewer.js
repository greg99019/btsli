const fs = require('fs')
const path = require('path')

const content = `'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout, { AuthUser } from '@/components/layout/PlatformLayout'

export default function TrainingViewer() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mod, setMod] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'video' | 'quiz' | 'complete'>('video')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [quizResult, setQuizResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) { router.replace('/login'); return }
      const { user: u } = await meRes.json()
      setUser(u)
      const res = await fetch('/api/training/' + id)
      if (!res.ok) { router.replace('/training'); return }
      const d = await res.json()
      const m = d.module
      setMod(m)
      if (m.progress?.completed) setTab('complete')
      else if (m.progress && m.progress.watchedPct >= m.minWatchPct && m.questions.length > 0) setTab('quiz')
      setLoading(false)
    }
    init()
  }, [id, router])

  async function handleMarkWatched() {
    await fetch('/api/training/' + id + '/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watchedPct: 1.0, lastSecond: 0 }),
    })
    if (mod?.questions.length === 0) setTab('complete')
    else setTab('quiz')
    setMod((prev: any) => prev ? { ...prev, progress: { completed: prev.questions.length === 0, watchedPct: 1.0, quizAttempts: prev.progress?.quizAttempts ?? 0 } } : prev)
  }

  async function handleQuizSubmit() {
    if (!mod) return
    const answersArr = mod.questions.map((q: any) => ({ questionId: q.id, choiceId: answers[q.id] ?? '' }))
    if (answersArr.some((a: any) => !a.choiceId)) { setErr('Please answer all questions.'); return }
    setSubmitting(true); setErr('')
    try {
      const res = await fetch('/api/training/' + id + '/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArr }),
      })
      const d = await res.json()
      if (!res.ok) { setErr(d.error ?? 'Failed.'); return }
      setQuizResult(d)
      if (d.passed) {
        setTab('complete')
        setMod((prev: any) => prev ? { ...prev, progress: { completed: true, watchedPct: 1.0, quizScore: d.score, quizAttempts: (prev.progress?.quizAttempts ?? 0) + 1 } } : prev)
      }
    } finally { setSubmitting(false) }
  }

  function getEmbed(url: string, type: string) {
    if (type === 'youtube') {
      try {
        const u = new URL(url)
        const v = u.searchParams.get('v') ?? (u.hostname === 'youtu.be' ? u.pathname.slice(1) : null)
        if (v) return 'https://www.youtube.com/embed/' + v
      } catch { /* noop */ }
    }
    if (type === 'vimeo') {
      const m = url.match(/vimeo\\.com\\/(\\d+)/)
      if (m) return 'https://player.vimeo.com/video/' + m[1]
    }
    return url
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user || !mod) return null

  const eUrl = mod.videoUrl ? getEmbed(mod.videoUrl, mod.videoType ?? 'youtube') : null

  return (
    <PlatformLayout user={user}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Link href="/training" className="text-slate-400 hover:text-slate-600 text-sm">Back to Training</Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{mod.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{mod.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
            <span>{mod.estimatedMinutes} min</span>
            <span>{Math.round(mod.passingScore * 100)}% to pass</span>
            {mod.isRequired && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Required</span>}
            {mod.progress?.completed && <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Completed</span>}
          </div>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['video', 'quiz', 'complete'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={'flex-1 py-2 rounded-lg text-sm font-medium transition-colors ' + (tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
              {t === 'video' ? 'Video' : t === 'quiz' ? 'Quiz' : 'Certificate'}
            </button>
          ))}
        </div>
        {tab === 'video' && (
          <div className="space-y-4">
            {eUrl ? (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden">
                {mod.videoType === 'direct'
                  ? <video src={eUrl} controls className="w-full h-full" />
                  : <iframe src={eUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" title={mod.title} />}
              </div>
            ) : <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">No video configured.</div>}
            {mod.longDescription && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">About This Module</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{mod.longDescription}</p>
              </div>
            )}
            {!mod.progress?.completed && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-800">Finished watching?</p>
                  <p className="text-xs text-blue-600 mt-0.5">Mark as watched to {mod.questions.length > 0 ? 'unlock the quiz' : 'complete this module'}.</p>
                </div>
                <button onClick={handleMarkWatched} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0">
                  Mark as Watched
                </button>
              </div>
            )}
          </div>
        )}
        {tab === 'quiz' && (
          <div className="space-y-4">
            {mod.progress?.completed
              ? <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                  <p className="font-semibold text-emerald-800">Quiz Completed</p>
                  {mod.progress.quizScore != null && <p className="text-sm text-emerald-600 mt-1">Score: {Math.round(mod.progress.quizScore * 100)}%</p>}
                </div>
              : mod.questions.length === 0
                ? <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-slate-500 text-sm">No quiz for this module.</div>
                : <>
                    {quizResult && !quizResult.passed && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                        <p className="font-semibold text-red-700">Not Passed - Score: {Math.round(quizResult.score * 100)}%</p>
                        <p className="text-sm text-red-600 mt-0.5">Required: {Math.round(mod.passingScore * 100)}%</p>
                      </div>
                    )}
                    {err && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{err}</div>}
                    {mod.questions.map((q: any, qi: number) => (
                      <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                        <p className="font-medium text-slate-800 mb-3">{qi + 1}. {q.prompt}</p>
                        <div className="space-y-2">
                          {q.choices.map((c: any) => (
                            <label key={c.id} className={'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ' + (answers[q.id] === c.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50')}>
                              <input type="radio" name={'q-' + q.id} value={c.id} checked={answers[q.id] === c.id} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: c.id }))} />
                              <span className="text-sm text-slate-700">{c.text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={handleQuizSubmit} disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  </>}
          </div>
        )}
        {tab === 'complete' && (
          <div>
            {mod.progress?.completed
              ? <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <h2 className="text-xl font-bold text-slate-800">Module Complete!</h2>
                  <p className="text-slate-600 mt-2">{mod.title}</p>
                  {mod.progress.quizScore != null && <p className="text-emerald-700 font-semibold mt-2">Quiz Score: {Math.round(mod.progress.quizScore * 100)}%</p>}
                  <p className="text-sm text-slate-500 mt-3">A certificate has been issued to your account.</p>
                  <Link href="/certificates" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">View Certificates</Link>
                </div>
              : <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                  Complete the video{mod.questions.length > 0 ? ' and pass the quiz' : ''} to earn your certificate.
                </div>}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
`

const outPath = path.join(__dirname, 'src', 'app', 'training', '[id]', 'page.tsx')
fs.writeFileSync(outPath, content, 'utf8')
console.log('Written:', outPath)
