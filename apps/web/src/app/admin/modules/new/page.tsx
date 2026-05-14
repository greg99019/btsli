'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  'GETTING_STARTED','WORKPLACE_SYSTEMS','COMMUNICATION','LEADERSHIP','SOPS',
  'ACCOUNTABILITY','CUSTOMER_SERVICE','COMPLIANCE_SAFETY','TEAM_COLLABORATION','PERFORMANCE_IMPROVEMENT'
]

const CATEGORY_LABELS: Record<string, string> = {
  GETTING_STARTED:'Getting Started',WORKPLACE_SYSTEMS:'Workplace Systems',COMMUNICATION:'Communication',
  LEADERSHIP:'Leadership',SOPS:'SOPs',ACCOUNTABILITY:'Accountability',CUSTOMER_SERVICE:'Customer Service',
  COMPLIANCE_SAFETY:'Compliance & Safety',TEAM_COLLABORATION:'Team Collaboration',PERFORMANCE_IMPROVEMENT:'Performance Improvement',
}

interface Choice { text: string; isCorrect: boolean }
interface Question { prompt: string; choices: Choice[] }

export default function NewModulePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title:'', description:'', longDescription:'', category:'GETTING_STARTED',
    videoUrl:'', videoType:'youtube', thumbnailUrl:'',
    estimatedMinutes:30, isRequired:false, passingScore:0.75, minWatchPct:0.8,
    isPublished:false, orderIdx:0,
  })
  const [questions, setQuestions] = useState<Question[]>([])

  function addQuestion() {
    setQuestions(prev => [...prev, { prompt:'', choices:[{text:'',isCorrect:true},{text:'',isCorrect:false},{text:'',isCorrect:false},{text:'',isCorrect:false}] }])
  }
  function updateQuestion(qi: number, val: string) {
    setQuestions(prev => prev.map((q,i) => i===qi ? {...q, prompt:val} : q))
  }
  function updateChoice(qi: number, ci: number, field: 'text'|'isCorrect', val: string|boolean) {
    setQuestions(prev => prev.map((q,i) => {
      if (i !== qi) return q
      if (field === 'isCorrect' && val === true) {
        return { ...q, choices: q.choices.map((c,j) => ({...c, isCorrect: j===ci})) }
      }
      return { ...q, choices: q.choices.map((c,j) => j===ci ? {...c, [field]:val} : c) }
    }))
  }
  function removeQuestion(qi: number) { setQuestions(prev => prev.filter((_,i) => i!==qi)) }

  async function handleSave(publish: boolean) {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/modules', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, isPublished: publish, questions })
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return }
      router.push('/admin/modules')
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/modules" className="text-slate-400 hover:text-slate-600 text-sm">← Back to Modules</Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Training Module</h1>
          <p className="text-slate-500 text-sm mt-0.5">Fill in the details below, then add quiz questions.</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{error}</div>}

        {/* Basic info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Module Info</h2>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title *" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Short description *" rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          <textarea value={form.longDescription} onChange={e=>setForm({...form,longDescription:e.target.value})} placeholder="Long description (optional)" rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c=><option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Estimated Minutes</label>
              <input type="number" value={form.estimatedMinutes} onChange={e=>setForm({...form,estimatedMinutes:+e.target.value})} min={1} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Passing Score (%)</label>
              <input type="number" value={Math.round(form.passingScore*100)} onChange={e=>setForm({...form,passingScore:+e.target.value/100})} min={0} max={100} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Min Watch % (for completion)</label>
              <input type="number" value={Math.round(form.minWatchPct*100)} onChange={e=>setForm({...form,minWatchPct:+e.target.value/100})} min={0} max={100} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={form.isRequired} onChange={e=>setForm({...form,isRequired:e.target.checked})} className="rounded" />
            Mark as required module
          </label>
        </div>

        {/* Video */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Video Content</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Video Type</label>
              <select value={form.videoType} onChange={e=>setForm({...form,videoType:e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="direct">Direct URL</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Video URL</label>
              <input value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} placeholder="https://..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Thumbnail URL (optional)</label>
            <input value={form.thumbnailUrl} onChange={e=>setForm({...form,thumbnailUrl:e.target.value})} placeholder="https://..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Quiz questions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Quiz Questions ({questions.length})</h2>
            <button onClick={addQuestion} className="text-blue-600 text-sm hover:underline">+ Add Question</button>
          </div>
          {questions.length === 0 && (
            <p className="text-sm text-slate-400">No quiz questions. Module completes on video watch only.</p>
          )}
          {questions.map((q, qi) => (
            <div key={qi} className="border border-slate-100 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-400 flex-shrink-0 mt-2">Q{qi+1}</span>
                <input value={q.prompt} onChange={e=>updateQuestion(qi,e.target.value)} placeholder="Question prompt..." className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={()=>removeQuestion(qi)} className="text-red-400 hover:text-red-600 mt-2 flex-shrink-0">✕</button>
              </div>
              <div className="space-y-2 pl-6">
                {q.choices.map((c, ci) => (
                  <div key={ci} className="flex items-center gap-2">
                    <input type="radio" name={`correct-${qi}`} checked={c.isCorrect} onChange={()=>updateChoice(qi,ci,'isCorrect',true)} className="flex-shrink-0" />
                    <input value={c.text} onChange={e=>updateChoice(qi,ci,'text',e.target.value)} placeholder={`Choice ${ci+1}`} className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <p className="text-xs text-slate-400">Select the radio button next to the correct answer.</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pb-6">
          <Link href="/admin/modules" className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</Link>
          <button onClick={()=>handleSave(false)} disabled={saving} className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors">{saving?'Saving...':'Save as Draft'}</button>
          <button onClick={()=>handleSave(true)} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">{saving?'Publishing...':'Publish'}</button>
        </div>
      </div>
    </div>
  )
}
