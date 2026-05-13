'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Slot = { id: string; startAt: string; endAt: string };

function token() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export default function CoachSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function refresh() {
    setErr('');
    const t = token();
    if (!t) {
      setErr('Login first (token missing).');
      return;
    }
    const res = await apiGet<Slot[]>('/booking/coach/slots', t);
    setSlots(res);
  }

  useEffect(() => {
    refresh().catch((e) => setErr(e.message));
  }, []);

  async function create() {
    setMsg('');
    setErr('');
    const t = token();
    if (!t) return setErr('Login first.');

    if (!startAt || !endAt) return setErr('Pick start and end.');
    try {
      await apiPost(
        '/booking/coach/slots',
        { startAt: new Date(startAt).toISOString(), endAt: new Date(endAt).toISOString() },
        t
      );
      setMsg('Slot created.');
      setStartAt('');
      setEndAt('');
      await refresh();
    } catch (e: any) {
      setErr(e.message ?? 'Failed');
    }
  }

  async function remove(slotId: string) {
    setMsg('');
    setErr('');
    const t = token();
    if (!t) return setErr('Login first.');

    const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';
    const res = await fetch(`${base}/booking/coach/slots/${slotId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${t}` },
    });
    if (!res.ok) return setErr(await res.text());
    setMsg('Slot deleted.');
    await refresh();
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Specialist Dashboard — Availability Slots</h1>

      <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 12 }}>
        <h3>Create slot</h3>
        <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
          <label>
            Start
            <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          </label>
          <label>
            End
            <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
          </label>
          <button onClick={create}>Add slot</button>
        </div>
      </div>

      <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 12 }}>
        <h3>My slots</h3>
        {slots.length === 0 ? (
          <p>No slots yet.</p>
        ) : (
          <ul>
            {slots.map((s) => (
              <li key={s.id} style={{ marginBottom: 8 }}>
                {new Date(s.startAt).toLocaleString()} → {new Date(s.endAt).toLocaleString()}
                <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {msg ? <p>{msg}</p> : null}
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
    </div>
  );
}
