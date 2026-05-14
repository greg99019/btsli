'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import PlatformLayout from '@/components/layout/PlatformLayout'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TrainingModule, UserProgress, Quiz, QuizQuestion, QuizAnswerOption } from '@/lib/types/database'

interface ModuleDetail extends TrainingModule {
  module_categories: { name: string; color: string } | null
  module_resources: { id: string; title: string; resource_type: string; url: string; sort_order: number }[]
  quizzes: (Quiz & {
    quiz_questions: (QuizQuestion & { quiz_answer_options: QuizAnswerOption[] })[]
  })[]
}

export default function TrainingModulePage() {
  const params = useParams()
  const moduleId = params.id as string
  const [profile, setProfile] = useState<Profile | null>(null)
  const [module, setModule] = useState<ModuleDetail | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }

      const [profileRes, moduleRes, progressRes] = await Promise.all([
        supabase.from('profiles').select('*, organizations(name)').eq('id', user.id).single(),
        supabase
          .from('training_modules')
          .select('*, module_categories(name, color), module_resources(*), quizzes(*, quiz_questions(*, quiz_answer_options(*)))')
          .eq('id', moduleId)
          .single(),
        supabase
          .from('user_progress')
          .select('*')
          .eq('module_id', moduleId)
          .eq('user_id', user.id)
          .maybeSingle(),
      ])

      setProfile(profileRes.data as Profile | null)
      setModule(moduleRes.data as ModuleDetail | null)
      setProgress(progressRes.data as UserProgress | null)
      setLoading(false)
    }
    load()
  }, [moduleId])

  const markProgress = async (pct: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !module) return
    setSaving(true)

    const status = pct >= 100 ? 'completed' : 'in_progress'
    const payload = {
      user_id: user.id,
      module_id: moduleId,
      status,
      progress_percentage: pct,
      completed_at: pct >= 100 ? new Date().toISOString() : null,
    }

    const { data } = await supabase
      .from('user_progress')
      .upsert(payload, { onConflict: 'user_id,module_id' })
      .select()
      .single()

    setProgress(data as UserProgress | null)
    setSaving(false)
  }

  const submitQuiz = async () => {
    const quiz = module?.quizzes?.[0]
    if (!quiz) return

    const mcQuestions = quiz.quiz_questions.filter(q => q.question_type !== 'short_answer')
    let correct = 0
    for (const q of mcQuestions) {
      const correctOption = q.quiz_answer_options.find(o => o.is_correct)
      if (correctOption && quizAnswers[q.id] === correctOption.id) correct++
    }
    const score = mcQuestions.length > 0 ? Math.round((correct / mcQuestions.length) * 100) : 100
    setQuizScore(score)
    setQuizSubmitted(true)

    if (score >= (quiz.passing_score ?? 70)) {
      await markProgress(100)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!module) {
    return (
      <PlatformLayout profile={profile}>
        <div className="p-6 text-center">
          <p className="text-slate-500">Module not found.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </PlatformLayout>
    )
  }

  const statusPct = progress?.progress_percentage ?? 0
  const isComplete = progress?.status === 'completed'
  const quiz = module.quizzes?.[0]
  const sortedResources = [...(module.module_resources ?? [])].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PlatformLayout profile={profile}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">{module.title}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              {module.module_categories && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium mb-2 inline-block">
                  {module.module_categories.name}
                </span>
              )}
              <h1 className="text-xl font-bold text-slate-800">{module.title}</h1>
              <p className="text-slate-500 mt-1 text-sm">{module.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                {module.duration_minutes && <span>⏱ {module.duration_minutes} min</span>}
                {module.facilitator_name && <span>👤 {module.facilitator_name}</span>}
                {module.is_required && <span className="text-red-600 font-medium">★ Required</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {isComplete ? (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">✓ Completed</span>
              ) : (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {statusPct > 0 ? `${statusPct}% complete` : 'Not started'}
                </span>
              )}
            </div>
          </div>

          {statusPct > 0 && (
            <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${statusPct}%` }} />
            </div>
          )}
        </div>

        {/* Video player */}
        {module.video_url && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-slate-900">
              <iframe
                src={module.video_url}
                className="w-full h-full"
                allowFullScreen
                title={module.title}
              />
            </div>
            {!isComplete && (
              <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-slate-600">Mark your viewing progress:</p>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => markProgress(pct)}
                      disabled={saving || statusPct >= pct}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        statusPct >= pct
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      } disabled:opacity-50`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {module.content && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-3">Module Content</h2>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">{module.content}</div>
            {!module.video_url && !isComplete && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => markProgress(100)}
                  disabled={saving}
                  className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Mark as Complete'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Resources */}
        {sortedResources.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-3">Resources</h2>
            <div className="space-y-2">
              {sortedResources.map(r => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span className="text-lg">
                    {r.resource_type === 'pdf' ? '📄' : r.resource_type === 'video' ? '🎬' : r.resource_type === 'link' ? '🔗' : '📁'}
                  </span>
                  <span className="text-slate-700 font-medium flex-1">{r.title}</span>
                  <span className="text-xs text-slate-400 uppercase">{r.resource_type}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Quiz */}
        {quiz && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">{quiz.title}</h2>
            <p className="text-xs text-slate-500 mb-4">Passing score: {quiz.passing_score ?? 70}%</p>

            {quizSubmitted ? (
              <div className={`rounded-xl p-6 text-center ${quizScore! >= (quiz.passing_score ?? 70) ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-3xl font-bold mb-2">{quizScore}%</p>
                <p className={`font-semibold ${quizScore! >= (quiz.passing_score ?? 70) ? 'text-emerald-700' : 'text-red-700'}`}>
                  {quizScore! >= (quiz.passing_score ?? 70) ? '🎉 Passed! Module complete.' : '❌ Did not pass. Review and try again.'}
                </p>
                {quizScore! < (quiz.passing_score ?? 70) && (
                  <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}) }} className="mt-4 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-900">
                    Retake Quiz
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {quiz.quiz_questions.map((q, qi) => (
                  <div key={q.id} className="border border-slate-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-800 mb-3">{qi + 1}. {q.question_text}</p>
                    {q.question_type === 'short_answer' ? (
                      <textarea
                        rows={3}
                        placeholder="Your answer…"
                        value={quizAnswers[q.id] ?? ''}
                        onChange={e => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    ) : (
                      <div className="space-y-2">
                        {q.quiz_answer_options.map(opt => (
                          <label key={opt.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 cursor-pointer">
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={opt.id}
                              checked={quizAnswers[q.id] === opt.id}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-slate-700">{opt.answer_text ?? opt.option_text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={submitQuiz}
                  disabled={saving}
                  className="w-full py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Submitting…' : 'Submit Quiz'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PlatformLayout>
  )
}
