'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type OutlineLesson = { id: string; title: string; type: string; progress: null | { status: string; percent: number } };
type OutlineModule = { id: string; title: string; lessons: OutlineLesson[] };

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function CourseOutlinePage({ params }: { params: { courseId: string } }) {
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
