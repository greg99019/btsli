'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Lesson = {
  id: string;
  title: string;
  type: string;
  videoUrl?: string | null;
  readingHtml?: string | null;
  courseId: string;
  assessmentId: string | null;
};

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    const t = token();
    if (!t) return setErr('Login first.');

    const l = await apiGet<Lesson>(`/lms/lessons/${params.lessonId}`, t);
    setLesson(l);

    const nxt = await apiGet<{ lessonId: string }>(`/lms/courses/${l.courseId}/next`, t);
    setNextLessonId(nxt.lessonId);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  async function markComplete() {
    setErr('');
    setMsg('');
    const t = token();
    if (!t) return setErr('Login first.');
    try {
      await apiPost(`/lms/lessons/${params.lessonId}/progress`, { completed: true, percent: 100 }, t);
      setMsg('Marked complete.');
      await load();
    } catch (e: any) {
      setErr(e.message ?? 'Failed');
    }
  }

  if (!lesson) return <div>{err ? <p style={{ color: 'crimson' }}>{err}</p> : <p>Loading…</p>}</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>{lesson.title}</h1>

      {lesson.type === 'VIDEO' && lesson.videoUrl ? (
        <div>
          <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Open video</a>
          <p>(Next step: embed player + track % watched.)</p>
        </div>
      ) : null}

      {lesson.type === 'READING' && lesson.readingHtml ? (
        <div dangerouslySetInnerHTML={{ __html: lesson.readingHtml }} />
      ) : null}

      {(lesson.type === 'QUIZ' || lesson.type === 'EXAM') && lesson.assessmentId ? (
        <a href={`/app/assessments/${lesson.assessmentId}`}>
          <button>Start {lesson.type}</button>
        </a>
      ) : null}

      <button onClick={markComplete}>Mark complete</button>

      {nextLessonId ? (
        <a href={`/app/lessons/${nextLessonId}`}>
          <button>Next</button>
        </a>
      ) : null}

      {msg ? <p>{msg}</p> : null}
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
    </div>
  );
}
