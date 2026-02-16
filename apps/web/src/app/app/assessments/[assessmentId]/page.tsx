'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';

type Assessment = {
  id: string;
  title: string;
  questions: { id: string; prompt: string; type: string; points: number; choices: { id: string; text: string }[] }[];
};

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function AssessmentPage({ params }: { params: { assessmentId: string } }) {
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const t = token();
    if (!t) return setErr('Login first.');
    apiGet<Assessment>(`/assessments/${params.assessmentId}`, t)
      .then(setAssessment)
      .catch((e) => setErr(e.message));
  }, [params.assessmentId]);

  async function start() {
    setErr('');
    const t = token();
    if (!t) return setErr('Login first.');
    const res = await apiPost<{ id: string }>(`/assessments/${params.assessmentId}/start`, {}, t);
    setAttemptId(res.id);
  }

  async function submit() {
    setErr('');
    setResult(null);
    const t = token();
    if (!t) return setErr('Login first.');
    if (!attemptId) return setErr('Start the quiz first.');

    for (const [questionId, choiceId] of Object.entries(answers)) {
      await apiPost(`/assessments/attempts/${attemptId}/answer`, { questionId, choiceId }, t);
    }

    const res = await apiPost(`/assessments/attempts/${attemptId}/submit`, {}, t);
    setResult(res);
  }

  if (!assessment) return <div>{err ? <p style={{ color: 'crimson' }}>{err}</p> : <p>Loading…</p>}</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1>{assessment.title}</h1>

      {!attemptId ? <button onClick={start}>Start attempt</button> : <p>Attempt started.</p>}

      {assessment.questions.map((q) => (
        <div key={q.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 12 }}>
          <div><b>{q.prompt}</b> ({q.points} pts)</div>
          <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
            {q.choices.map((c) => (
              <label key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="radio"
                  name={q.id}
                  value={c.id}
                  checked={answers[q.id] === c.id}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                />
                {c.text}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={submit} disabled={!attemptId}>Submit</button>

      {result ? (
        <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 12 }}>
          <h3>Result</h3>
          <div>Score: {Math.round(result.scorePct)}%</div>
          <div>Earned: {result.earned} / {result.possible}</div>
        </div>
      ) : null}

      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
    </div>
  );
}
