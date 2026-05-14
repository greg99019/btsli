const fs = require('fs')
const path = require('path')

const content = `'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Choice { id: string; text: string; isCorrect: boolean }
interface Question { id: string; prompt: string; choices: Choice[] }
interface ModuleForm {
  title: string; description: string; longDescription: string; category: string
  estimatedMinutes: string; passingScore: string; minWatchPct: string
  isRequired: boolean; isPublished: boolean
  videoUrl: string; videoType: string; thumbnailUrl: string
}

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<ModuleForm>({ title: '', description: '', longDescription: '', category: 'Compliance', estimatedMinutes: '30', passingScore: '70', minWatchPct: '80', isRequired: false, isPublished: false, videoUrl: '', videoType: 'youtube', thumbnailUrl: '' })
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/modules/' + id)
      .then(r => r.json())
      .then(d => {
        const m = d.module
        if (!m) { router.replace('/admin/modules'); return }
        setForm({
          title: m.title ?? '', description: m.description ?? '', longDescription: m.longDescription ?? '',
          category: m.category ?? 'Compliance', estimatedMinutes: String(m.estimatedMinutes ?? 30),
          passingScore: String(Math.round((m.passingScore ?? 0.7) * 100)),
          minWatchPct: String(Math.round((m.minWatchPct ?? 0.8) * 100)),
          isRequired: m.isRequired ?? false, isPublished: m.isPublished ?? false,
          videoUrl: m.videoUrl ?? '', videoType: m.videoType ?? 'youtube', thumbnailUrl: m.thumbnailUrl ?? '',
        })
        setQuestions((m.questions ?? []).map((q: any) => ({
          id: q.id, prompt: q.prompt,
          choices: (q.choices ?? []).map((c: any) => ({ id: c.id, text: c.text, isCorrect: c.isCorrect })),
        })))
        setLoading(false)
      })
      .catch(() => router.replace('/admin/modules'))
  }, [id, router])

  function addQuestion() {
    const newId = 'new-' + Date.now()
    setQuestions(prev => [...prev, { id: newId, prompt: '', choices: [{ id: newId + '-1', text: '', isCorrect: true }, { id: newId + '-2', text: '', isCorrect: false }] }])
  }
  function removeQuestion(qid: string) { setQuestions(prev => prev.filter(q => q.id !== qid)) }
  function updateQuestion(qid: string, prompt: string) { setQuestions(prev => prev.map(q => q.id === qid ? { ...q, prompt } : q)) }
  function addChoice(qid: string) { setQuestions(prev => prev.map(q => q.id === qid ? { ...q, choices: [...q.choices, { id: 'new-' + Date.now(), text: '', isCorrect: false }] } : q)) }
  function removeChoice(qid: string, cid: string) { setQuestions(prev => prev.map(q => q.id === qid ? { ...q, choices: q.choices.filter(c => c.id !== cid) } : q)) }
  function updateChoice(qid: string, cid: string, text: string) { setQuestions(prev => prev.map(q => q.id === qid ? { ...q, choices: q.choices.map(c => c.id === cid ? { ...c, text } : c) } : q)) }
  function setCorrect(qid: string, cid: string) { setQuestions(prev => prev.map(q => q.id === qid ? { ...q, choices: q.choices.map(c => ({ ...c, isCorrect: c.id === cid })) } : q)) }

  async function save(publish?: boolean) {
    setError(''); setSaving(true)
    const payload = {
      ...form,
      estimatedMinutes: parseInt(form.estimatedMinutes) || 30,
      passingScore: (parseInt(form.passingScore) || 70) / 100,
      minWatchPct: (parseInt(form.minWatchPct) || 80) / 100,
      isPublished: publish !== undefined ? publish : form.isPublished,
      questions: questions.map(q => ({ prompt: q.prompt, choices: q.choices })),
    }
    try {
      const res = await fetch('/api/admin/modules/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Failed to save.'); return }
      router.push('/admin/modules')
    } catch { setError('Network error.') } finally { setSaving(false) }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  const CATEGORIES = ['Compliance', 'Safety', 'Leadership', 'HR', 'Technical', 'Soft Skills', 'Onboarding', 'Other']

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/modules" className="text-slate-400 hover:text-slate-600 text-sm">Back to Modules</Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Edit Training Module</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => save(false)} disabled={saving} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-100 disabled:opacity-50">Save Draft</button>
            <button onClick={() => save(true)} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save & Publish'}</button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Module Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Long Description</label>
            <textarea value={form.longDescription} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} rows={4} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
              <input type="number" value={form.estimatedMinutes} onChange={e => setForm(f => ({ ...f, estimatedMinutes: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Passing Score (%)</label>
              <input type="number" min="0" max="100" value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min Watch (%)</label>
              <input type="number" min="0" max="100" value={form.minWatchPct} onChange={e => setForm(f => ({ ...f, minWatchPct: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={form.isRequired} onChange={e => setForm(f => ({ ...f, isRequired: e.target.checked }))} />
            Required module
          </label>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Video</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Video Type</label>
              <select value={form.videoType} onChange={e => setForm(f => ({ ...f, videoType: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="direct">Direct URL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
              <input value={form.thumbnailUrl} onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
            <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Quiz Questions ({questions.length})</h2>
            <button onClick={addQuestion} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Question</button>
          </div>
          {questions.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No questions yet. Module will complete after video.</p>}
          {questions.map((q, qi) => (
            <div key={q.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xs font-medium text-slate-400 mt-2.5 flex-shrink-0">Q{qi + 1}</span>
                <input value={q.prompt} onChange={e => updateQuestion(q.id, e.target.value)} placeholder="Question text..." className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 text-sm flex-shrink-0 mt-1">Remove</button>
              </div>
              <div className="ml-7 space-y-2">
                {q.choices.map((c, ci) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <input type="radio" name={'correct-' + q.id} checked={c.isCorrect} onChange={() => setCorrect(q.id, c.id)} className="flex-shrink-0" />
                    <input value={c.text} onChange={e => updateChoice(q.id, c.id, e.target.value)} placeholder={"Choice " + (ci + 1)} className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {q.choices.length > 2 && <button onClick={() => removeChoice(q.id, c.id)} className="text-slate-300 hover:text-red-400 text-xs">x</button>}
                  </div>
                ))}
                <button onClick={() => addChoice(q.id)} className="text-xs text-slate-400 hover:text-slate-600">+ Add choice</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pb-8">
          <Link href="/admin/modules" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-100">Cancel</Link>
          <div className="flex gap-2">
            <button onClick={() => save(false)} disabled={saving} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-100 disabled:opacity-50">Save Draft</button>
            <button onClick={() => save(true)} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save & Publish'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
`

const outPath = path.join(__dirname, 'src', 'app', 'admin', 'modules', '[id]', 'edit', 'page.tsx')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, content, 'utf8')
console.log('Written:', outPath)
