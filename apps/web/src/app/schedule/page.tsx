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

function StepBadge({ num, active, done }: { num: number; active: boolean; done: boolean }) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
        done
          ? 'bg-green-500 text-white'
          : active
          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
      }`}
    >
      {done ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        num
      )}
    </div>
  );
}

export default function SchedulePage() {
  const token = useMemo(() => getToken(), []);
  const [services, setServices] = useState<Service[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [serviceId, setServiceId] = useState<string>('');
  const [coachId, setCoachId] = useState<string>('');
  const [slotId, setSlotId] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [booked, setBooked] = useState<boolean>(false);
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
    setErr('');
    if (!serviceId) return;

    apiGet<Coach[]>(`/booking/coaches?serviceId=${encodeURIComponent(serviceId)}`)
      .then(setCoaches)
      .catch((e) => setErr(e.message));
  }, [serviceId]);

  useEffect(() => {
    setSlotId('');
    setSlots([]);
    setErr('');
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
      setErr('You must be logged in to book an appointment. Please login first.');
      return;
    }
    const chosen = slots.find((s) => s.id === slotId);
    if (!chosen) {
      setErr('Please select a time slot.');
      return;
    }

    setLoading(true);
    try {
      await apiPost(
        '/booking/appointments',
        { coachId, serviceId, startAt: chosen.startAt, endAt: chosen.endAt },
        token
      );
      setBooked(true);
      setMsg('Your appointment has been booked! You can view it in your Client Portal dashboard.');
    } catch (e: any) {
      setErr(e.message ?? 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const step1Done = !!serviceId;
  const step2Done = !!coachId;
  const step3Done = !!slotId;
  const currentStep = !step1Done ? 1 : !step2Done ? 2 : !step3Done ? 3 : 4;

  const selectedService = services.find((s) => s.id === serviceId);
  const selectedCoach = coaches.find((c) => c.id === coachId);
  const selectedSlot = slots.find((s) => s.id === slotId);

  if (booked) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="card text-center space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Appointment Confirmed!</h1>
            <p className="text-gray-600 mt-2 text-lg">{msg}</p>
          </div>
          {selectedService && selectedCoach && selectedSlot && (
            <div className="bg-white rounded-xl p-6 border border-green-200 text-left space-y-3">
              <h3 className="font-bold text-gray-800 text-lg">Booking Summary</h3>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span><strong>Service:</strong> {selectedService.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span><strong>Specialist:</strong> {selectedCoach.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span><strong>Time:</strong> {new Date(selectedSlot.startAt).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center">
              View in Client Portal
            </a>
            <button
              onClick={() => { setBooked(false); setServiceId(''); setCoachId(''); setSlotId(''); setMsg(''); }}
              className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-700 font-semibold rounded-lg hover:border-blue-400 transition-all"
            >
              Schedule Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">

      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm">
          Consultation Booking
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
          Schedule Your Consultation
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
          Complete the steps below to book a consultation with a BTSLI™ specialist. We will confirm your appointment promptly.
        </p>
      </div>

      {/* Login Notice */}
      {!token && (
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-amber-800">Login Required to Book</p>
            <p className="text-amber-700 text-sm mt-0.5">
              You can browse services and times, but you will need to{' '}
              <a href="/login" className="underline font-medium hover:text-amber-900">log in</a>{' '}
              before confirming your appointment.
            </p>
          </div>
        </div>
      )}

      {/* Step Progress Bar */}
      <div className="card bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center gap-2 sm:gap-4">
          {[
            { num: 1, label: 'Service', done: step1Done },
            { num: 2, label: 'Specialist', done: step2Done },
            { num: 3, label: 'Date & Time', done: step3Done },
            { num: 4, label: 'Confirm', done: false },
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 min-w-0">
                <StepBadge num={step.num} active={currentStep === step.num} done={step.done} />
                <span className={`text-xs font-medium hidden sm:block ${step.done ? 'text-green-600' : currentStep === step.num ? 'text-blue-700' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${step.done ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 — Service */}
      <div className={`card transition-all ${step1Done ? 'border-2 border-green-200 bg-green-50/30' : 'border-2 border-blue-200'}`}>
        <div className="flex items-center gap-4 mb-5">
          <StepBadge num={1} active={currentStep === 1} done={step1Done} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Choose a Service</h2>
            <p className="text-sm text-gray-500">Select the consulting service that best fits your organization's needs.</p>
          </div>
        </div>

        <div className="grid gap-3">
          {services.length === 0 && !err && (
            <div className="flex items-center gap-3 text-gray-500 py-4">
              <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading services…
            </div>
          )}
          {services.map((s) => (
            <label
              key={s.id}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                serviceId === s.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <input
                type="radio"
                name="service"
                value={s.id}
                checked={serviceId === s.id}
                onChange={() => setServiceId(s.id)}
                className="mt-1 accent-blue-600"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{s.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {s.durationMin} min &nbsp;·&nbsp; ${s.priceMin}–${s.priceMax} {s.unitLabel}
                </p>
              </div>
              {serviceId === s.id && (
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Step 2 — Specialist */}
      <div className={`card transition-all ${!step1Done ? 'opacity-50 pointer-events-none' : step2Done ? 'border-2 border-green-200 bg-green-50/30' : 'border-2 border-blue-200'}`}>
        <div className="flex items-center gap-4 mb-5">
          <StepBadge num={2} active={currentStep === 2} done={step2Done} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Select a Specialist</h2>
            <p className="text-sm text-gray-500">Select the BTSLI™ specialist who will lead your consultation.</p>
          </div>
        </div>

        <div className="grid gap-3">
          {step1Done && coaches.length === 0 && !err && (
            <div className="flex items-center gap-3 text-gray-500 py-4">
              <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading specialists…
            </div>
          )}
          {!step1Done && (
            <p className="text-gray-400 text-sm py-2">Please select a service first.</p>
          )}
          {coaches.map((c) => (
            <label
              key={c.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                coachId === c.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <input
                type="radio"
                name="coach"
                value={c.id}
                checked={coachId === c.id}
                onChange={() => setCoachId(c.id)}
                className="accent-blue-600"
              />
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500">{c.timezone}</p>
              </div>
              {coachId === c.id && (
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Step 3 — Date & Time */}
      <div className={`card transition-all ${!step2Done ? 'opacity-50 pointer-events-none' : step3Done ? 'border-2 border-green-200 bg-green-50/30' : 'border-2 border-blue-200'}`}>
        <div className="flex items-center gap-4 mb-5">
          <StepBadge num={3} active={currentStep === 3} done={step3Done} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Choose a Date &amp; Time</h2>
            <p className="text-sm text-gray-500">Available slots for the next 14 days are shown below.</p>
          </div>
        </div>

        {!step2Done && (
          <p className="text-gray-400 text-sm py-2">Please select a specialist first.</p>
        )}

        {step2Done && slots.length === 0 && !err && (
          <div className="flex items-center gap-3 text-gray-500 py-4">
            <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading available times…
          </div>
        )}

        {step2Done && slots.length === 0 && err && (
          <p className="text-gray-500 text-sm py-2">No available slots found for the selected specialist in the next 14 days.</p>
        )}

        {slots.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {slots.map((s) => {
              const start = new Date(s.startAt);
              const end = new Date(s.endAt);
              return (
                <label
                  key={s.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    slotId === s.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={s.id}
                    checked={slotId === s.id}
                    onChange={() => setSlotId(s.id)}
                    className="accent-blue-600 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} – {end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 4 — Confirm */}
      <div className={`card transition-all ${!step3Done ? 'opacity-50 pointer-events-none' : 'border-2 border-blue-200'}`}>
        <div className="flex items-center gap-4 mb-5">
          <StepBadge num={4} active={currentStep === 4} done={false} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Confirm Your Appointment</h2>
            <p className="text-sm text-gray-500">Review your selection and submit to confirm your booking.</p>
          </div>
        </div>

        {step3Done && (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 mb-6 space-y-3 border border-blue-100">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">Booking Summary</h3>
            {selectedService && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span><strong>Service:</strong> {selectedService.name}</span>
              </div>
            )}
            {selectedCoach && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span><strong>Specialist:</strong> {selectedCoach.name}</span>
              </div>
            )}
            {selectedSlot && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>
                  <strong>Date & Time:</strong>{' '}
                  {new Date(selectedSlot.startAt).toLocaleString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        <button
          disabled={!step1Done || !step2Done || !step3Done || loading}
          onClick={book}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Confirming Your Appointment…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Confirm Appointment
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {err && (
        <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700">{err}</p>
        </div>
      )}

      {/* Help Note */}
      <div className="card bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 flex items-start gap-4">
        <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <div>
          <p className="font-semibold text-gray-800">Need assistance?</p>
          <p className="text-sm text-gray-600 mt-0.5">
            If you have questions about which service is right for your organization, contact us directly at{' '}
            <a href="https://btsli.com" className="text-blue-600 underline hover:text-blue-800">btsli.com</a>{' '}
            and a specialist will reach out to guide you.
          </p>
        </div>
      </div>

    </div>
  );
}
