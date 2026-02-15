'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function CourseGradesPage({ params }: { params: { courseId: string } }) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const t = token();
    if (!t) return setErr('Login first.');
    apiGet(`/grades/courses/${params.courseId}/me`, t)
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [params.courseId]);

  async function downloadCertificate() {
    const t = token();
    if (!t) return setErr('Login first.');

    const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';
    const res = await fetch(`${base}/certificates/courses/${params.courseId}/me/pdf`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (!res.ok) return setErr(await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${params.courseId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!data) return <div>{err ? <p style={{ color: 'crimson' }}>{err}</p> : <p>Loading…</p>}</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>My Gradebook</h1>

      <div>
        <b>Overall:</b> {data.overallScorePct == null ? 'N/A' : `${Math.round(data.overallScorePct)}%`}
      </div>

      <ul>
        {data.items.map((i: any) => (
          <li key={i.assessmentId}>
            {i.title}: {i.bestScorePct == null ? 'N/A' : `${Math.round(i.bestScorePct)}%`}
          </li>
        ))}
      </ul>

      <button onClick={downloadCertificate}>Download Certificate (PDF)</button>

      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
    </div>
  );
}
