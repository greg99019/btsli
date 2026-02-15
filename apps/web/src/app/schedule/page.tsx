'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Service = { id: string; name: string; durationMin: number; priceMin: number; priceMax: number; unitLabel: string };
type Coach = { id: string; name: string; timezone: string };
type Slot = { id: string; startAt: string; endAt: string };

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export default function SchedulePage() {
  const token = useMemo(() => getToken(), []);
  const [services, setServices] = useState<Service[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [serviceId, setServiceId] = useState<string>('');
  const [coachId, setCoachId] = useState<string>('');
  const [slotId, setSlotId] = useState<string>('');

  const [msg, setMsg] = useState<string>('');
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    apiGet<Service[]>('/services')
      .then(setServices)
      .catch((e) => setErr(e.message));
  }, []);

  useEffect(() => {
    setCoachId('');
    setSlotId('');
    setSlots([]);
    if (!serviceId) return;

    apiGet<Coach[]>(`/booking/coaches?serviceId=${encodeURIComponent(serviceId)}`)
      .then(setCoaches)
      .catch((e) => setErr(e.message));
  }, [serviceId]);

  useEffect(() => {
    setSlotId('');
    setSlots([]);
    if (!coachId) return;

    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 14);

    apiGet<Slot[]>(
      `/booking/coaches/${encodeURIComponent(coachId)}/availability?from=${from.toISOString()}&to=${to.toISOString()}`
    )
      .then(setSlots)
      .catch((e) => setErr(e.message));
  }, [coachId]);

  async function book() {
    setErr('');
    setMsg('');
    if (!token) {
      setErr('Please login first (token required).');
      return;
    }
    const chosen = slots.find((s) => s.id === slotId);
    if (!chosen) {
      setErr('Pick a time slot.');
      return;
    }

    try {
      await apiPost(
        '/booking/appointments',
        { coachId, serviceId, startAt: chosen.startAt, endAt: chosen.endAt },
        token
      );
      setMsg('Booked! Check your dashboard (appointments).');
    } catch (e: any) {
      setErr(e.message ?? 'Booking failed');
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Schedule your appointment</h1>

      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <h3>Step 1 — Choose Service</h3>
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">Select a service...</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} (${s.priceMin}–${s.priceMax} {s.unitLabel})
            </option>
          ))}
        </select>
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <h3>Step 2 — Choose Coach</h3>
        <select disabled={!serviceId} value={coachId} onChange={(e) => setCoachId(e.target.value)}>
          <option value="">Select a coach...</option>
          {coaches.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.timezone})
            </option>
          ))}
        </select>
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <h3>Step 3 — Choose Time</h3>
        {!coachId ? (
          <p>Pick a coach to see availability.</p>
        ) : slots.length === 0 ? (
          <p>No slots returned (coach might not have availability set yet).</p>
        ) : (
          <select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
            <option value="">Select a time slot...</option>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.startAt).toLocaleString()} → {new Date(s.endAt).toLocaleString()}
              </option>
            ))}
          </select>
        )}
      </div>

      <button disabled={!serviceId || !coachId || !slotId} onClick={book}>
        Book appointment
      </button>

      {msg ? <p>{msg}</p> : null}
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}
    </div>
  );
}
