'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

type OutlineLesson = { id: string; title: string; type: string; progress: null | { status: string; percent: number } };
type OutlineModule = { id: string; title: string; lessons: OutlineLesson[] };

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function CourseOutlinePage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const [modules, setModules] = useState<OutlineModule[]>([]);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [err, setErr] = useState('');

  async function load() {
    const t = token();
    if (!t) return setErr('Login first.');
    const outline = await apiGet<OutlineModule[]>(`/lms/courses/${params.courseId}/outline`, t);
    setModules(outline);
    const next = await apiGet<{ lessonId: string }>(`/lms/courses/${params.courseId}/next`, t);
    setNextLessonId(next.lessonId);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors w-fit"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1>Course Outline</h1>
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}

      {nextLessonId ? (
        <div>
          <a href={`/app/lessons/${nextLessonId}`}>
            <button>Continue (Next)</button>
          </a>
        </div>
      ) : null}

      {modules.map((m) => (
        <div key={m.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 12 }}>
          <h3>{m.title}</h3>
          <ul>
            {m.lessons.map((l) => (
              <li key={l.id}>
                <a href={`/app/lessons/${l.id}`}>{l.title}</a> — {l.type}
                {l.progress ? ` — ${l.progress.status} (${Math.round(l.progress.percent)}%)` : ''}
                {l.id === nextLessonId ? ' ← next' : ''}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <a href={`/app/courses/${params.courseId}/grades`}>View grades</a>
      </div>
    </div>
  );
}
