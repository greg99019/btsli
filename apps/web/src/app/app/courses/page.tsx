'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

type Course = { id: string; title: string; description?: string | null };

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    const t = token();
    if (!t) return setErr('Login first.');
    apiGet<Course[]>('/lms/me/courses', t)
      .then(setCourses)
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
      {courses.length === 0 ? (
        <p>No enrolled courses yet.</p>
      ) : (
        <ul>
          {courses.map((c) => (
            <li key={c.id}>
              <a href={`/app/courses/${c.id}`}>{c.title}</a>
              {c.description ? <div>{c.description}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
