'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId') ?? '';
  const complete = searchParams.get('complete') === 'true';

  if (complete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          Assessment Complete
        </h1>
        <p className="text-lg text-slate-600 mb-3 max-w-lg mx-auto">
          Thank you for completing the full Systems Assessment. Your responses have been received and
          your consultant briefing is being prepared.
        </p>
        <p className="text-slate-500 mb-8">
          A member of our team will reach out within <strong>1–2 business days</strong> with your
          pre-consultation summary, recommended next steps, and scheduling options.
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left">
          <h2 className="text-lg font-bold text-blue-800 mb-4">What happens next</h2>
          <ol className="space-y-3">
            {[
              { n: '1', title: 'Briefing preparation', desc: 'We review your assessment and generate your pre-call summary, including identified root causes and a recommended service path.' },
              { n: '2', title: 'Consultation scheduling', desc: 'You\'ll receive an email with scheduling options aligned to your preferred times and engagement fit.' },
              { n: '3', title: 'Consultation review', desc: 'We walk through your assessment, answer your questions, and outline a clear path forward.' },
              { n: '4', title: 'Scope or proposal review', desc: 'If there\'s a fit, we\'ll send a tailored proposal or engagement scope aligned to your goals, budget, and timeline.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step.n}
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm">{step.title}</div>
                  <div className="text-slate-500 text-sm">{step.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/services"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
            Learn About Our Services
          </a>
          <a href="/about"
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition">
            About BTSLI™
          </a>
        </div>
      </div>
    );
  }

  // After initial intake (before assessment)
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
        We&apos;ve received your request.
      </h1>
      <p className="text-lg text-slate-600 mb-3 max-w-lg mx-auto">
        A confirmation has been sent to your email. Your initial responses have been reviewed
        and will be used to identify the most appropriate service path.
      </p>

      {/* Assessment CTA */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 sm:p-8 mb-8 text-left">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📋</div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-orange-800 mb-2">
              One more step — complete the Systems Assessment
            </h2>
            <p className="text-orange-700 text-sm mb-4">
              To make your consultation as focused and useful as possible, please complete the
              10-minute Systems Assessment. It helps us identify specific breakdown points,
              prepare a consultant briefing, and determine likely engagement priorities before we speak.
            </p>
            {leadId && (
              <a
                href={`/intake/assessment?leadId=${leadId}`}
                className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition">
                Continue to the Systems Assessment →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-left mb-8">
        <h2 className="text-base font-bold text-slate-700 mb-4">What to expect</h2>
        <div className="space-y-3">
          {[
            { icon: '📧', text: 'Check your inbox for a confirmation email with your assessment link.' },
            { icon: '⏱️', text: 'The Systems Assessment takes about 8–12 minutes to complete.' },
            { icon: '📞', text: 'A consultant will contact you within 1–2 business days to coordinate the next-step conversation.' },
            { icon: '🔒', text: 'All responses are confidential and used only to prepare your review and consultation.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg">{item.icon}</span>
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <a href="/" className="text-blue-600 hover:underline text-sm">← Return to homepage</a>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading…</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
