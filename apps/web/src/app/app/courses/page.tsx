'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Course = { id: string; title: string; description?: string | null };

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function MyCoursesPage() {
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
    <div>
      <h1>My Courses</h1>
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
