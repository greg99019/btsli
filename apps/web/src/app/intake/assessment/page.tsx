'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE = '';

type Ratings = {
  communication: number[];
  trainingOnboarding: number[];
  accountability: number[];
  documentation: number[];
  teamCoordination: number[];
  performanceTracking: number[];
  leadershipAlignment: number[];
};

type TextAnswers = {
  painPoints: string;
  currentMetrics: string;
  successIn30Days: string;
  successIn60Days: string;
  successIn90Days: string;
  wishCouldMeasure: string;
};

const SECTIONS = [
  {
    key: 'communication' as keyof Ratings,
    title: 'Communication Systems',
    icon: '💬',
    questions: [
      'Our team receives consistent, clear communication about expectations and priorities.',
      'Communication breakdowns are rare in our organization.',
      'We have a reliable system for sharing updates across departments and teams.',
    ],
  },
  {
    key: 'trainingOnboarding' as keyof Ratings,
    title: 'Training & Onboarding',
    icon: '📚',
    questions: [
      'New team members receive a structured, effective onboarding experience.',
      'Staff training is consistent, documented, and actually followed through.',
      'We have clearly defined learning and development paths for our staff.',
    ],
  },
  {
    key: 'accountability' as keyof Ratings,
    title: 'Accountability Structures',
    icon: '✅',
    questions: [
      'Team members consistently follow through on commitments and responsibilities.',
      'We have clear, measurable accountability structures at every level.',
      'When something falls short, we address it promptly and systematically.',
    ],
  },
  {
    key: 'documentation' as keyof Ratings,
    title: 'Documentation & SOPs',
    icon: '📋',
    questions: [
      'How consistently does your team follow documented processes?',
      'Critical processes in our organization are written down and accessible to staff.',
      'Our SOPs and process documents are kept updated as things evolve.',
    ],
  },
  {
    key: 'teamCoordination' as keyof Ratings,
    title: 'Team Coordination',
    icon: '🤝',
    questions: [
      'Teams across our organization collaborate effectively and without friction.',
      'Handoffs between departments are smooth and rarely cause delays or confusion.',
      'We have clear ownership for every major function in our organization.',
    ],
  },
  {
    key: 'performanceTracking' as keyof Ratings,
    title: 'Performance Tracking',
    icon: '📊',
    questions: [
      'We regularly track and review performance data at the team and organizational level.',
      'Performance metrics are clearly defined and understood by staff.',
      'We use data to make decisions and course-correct when needed.',
    ],
  },
  {
    key: 'leadershipAlignment' as keyof Ratings,
    title: 'Leadership Alignment',
    icon: '🧭',
    questions: [
      'Leadership is aligned on organizational direction, priorities, and values.',
      'Leaders model the behaviors and systems they expect from staff.',
      'Leadership communicates decisions transparently and consistently across the organization.',
    ],
  },
];

const TOTAL_SECTIONS = SECTIONS.length + 1; // +1 for the success metrics text section

function RatingScale({
  question, value, onChange, index,
}: { question: string; value: number; onChange: (v: number) => void; index: number }) {
  const labels = ['Not at all', 'Rarely', 'Sometimes', 'Often', 'Very consistently'];
  return (
    <div className="mb-6">
      <p className="text-sm sm:text-base text-slate-700 font-medium mb-3">
        <span className="text-blue-600 font-bold mr-2">{index + 1}.</span>
        {question}
      </p>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={`flex-1 min-w-[44px] py-2.5 rounded-lg border text-sm font-bold transition ${
              value === n
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600'
            }`}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1 px-0.5">
        <span>Not at all</span>
        <span>Very consistently</span>
      </div>
      {value > 0 && (
        <p className="text-xs text-blue-600 mt-1 font-medium">{labels[value - 1]}</p>
      )}
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-slate-500 mb-2">
        <span>Section {current + 1} of {total}</span>
        <span>{Math.round(((current + 1) / total) * 100)}% complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function AssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId') ?? '';

  const [sectionIdx, setSectionIdx] = useState(0);
  const [ratings, setRatings] = useState<Ratings>({
    communication: [0, 0, 0],
    trainingOnboarding: [0, 0, 0],
    accountability: [0, 0, 0],
    documentation: [0, 0, 0],
    teamCoordination: [0, 0, 0],
    performanceTracking: [0, 0, 0],
    leadershipAlignment: [0, 0, 0],
  });
  const [text, setText] = useState<TextAnswers>({
    painPoints: '', currentMetrics: '', successIn30Days: '',
    successIn60Days: '', successIn90Days: '', wishCouldMeasure: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLastSection = sectionIdx === SECTIONS.length; // text section
  const currentSection = sectionIdx < SECTIONS.length ? SECTIONS[sectionIdx] : null;

  function validateSection(): boolean {
    if (currentSection) {
      const sectionRatings = ratings[currentSection.key];
      if (sectionRatings.some((r) => r === 0)) {
        setError('Please answer all questions before continuing.');
        return false;
      }
    } else {
      if (!text.successIn30Days.trim() || !text.successIn60Days.trim() || !text.successIn90Days.trim()) {
        setError('Please complete the 30, 60, and 90-day success fields.');
        return false;
      }
    }
    setError('');
    return true;
  }

  function setRating(key: keyof Ratings, idx: number, val: number) {
    setRatings((r) => ({
      ...r,
      [key]: r[key].map((v, i) => (i === idx ? val : v)),
    }));
  }

  function next() {
    if (!validateSection()) return;
    setSectionIdx((i) => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setSectionIdx((i) => i - 1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit() {
    if (!validateSection()) return;
    if (!leadId) {
      setError('Missing lead ID. Please return to the intake form and start again.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...ratings, ...text };
      const res = await fetch(`${API_BASE}/api/intake/assessment/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push(`/intake/confirmation?complete=true&leadId=${leadId}`);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-3">
          Step 2 of 2 · Systems Assessment
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Organizational Systems Assessment</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Rate each statement honestly. There are no right or wrong answers — your responses help us identify
          where support will have the most impact.
        </p>
      </div>

      <ProgressBar current={sectionIdx} total={TOTAL_SECTIONS} />

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">

        {/* Rated section */}
        {currentSection && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <span className="text-3xl">{currentSection.icon}</span>
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Section {sectionIdx + 1} of {SECTIONS.length}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{currentSection.title}</h2>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-5 italic">
              1 = Not at all · 2 = Rarely · 3 = Sometimes · 4 = Often · 5 = Very consistently
            </p>
            {currentSection.questions.map((q, i) => (
              <RatingScale
                key={i}
                question={q}
                value={ratings[currentSection.key][i]}
                onChange={(v) => setRating(currentSection.key, i, v)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Text / Success Metrics section */}
        {isLastSection && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <span className="text-3xl">🎯</span>
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Final Section
                </div>
                <h2 className="text-xl font-bold text-slate-800">Defining Success</h2>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              These answers will be turned into draft KPIs for your engagement and help us build a
              meaningful baseline before we begin.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  What would improvement look like in <span className="text-blue-600">30 days</span>? <span className="text-red-500">*</span>
                </label>
                <textarea rows={2} value={text.successIn30Days}
                  onChange={(e) => setText((t) => ({ ...t, successIn30Days: e.target.value }))}
                  placeholder="What's a realistic win in the first month?"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  What would improvement look like in <span className="text-blue-600">60 days</span>? <span className="text-red-500">*</span>
                </label>
                <textarea rows={2} value={text.successIn60Days}
                  onChange={(e) => setText((t) => ({ ...t, successIn60Days: e.target.value }))}
                  placeholder="What would the team feel or see by month two?"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  What would improvement look like in <span className="text-blue-600">90 days</span>? <span className="text-red-500">*</span>
                </label>
                <textarea rows={2} value={text.successIn90Days}
                  onChange={(e) => setText((t) => ({ ...t, successIn90Days: e.target.value }))}
                  placeholder="What would a successful 90-day outcome look like?"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  What metrics do you currently track? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea rows={2} value={text.currentMetrics}
                  onChange={(e) => setText((t) => ({ ...t, currentMetrics: e.target.value }))}
                  placeholder="e.g. client satisfaction scores, staff retention rate, project completion rate…"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  What do you <em>wish</em> you could measure? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea rows={2} value={text.wishCouldMeasure}
                  onChange={(e) => setText((t) => ({ ...t, wishCouldMeasure: e.target.value }))}
                  placeholder="What would you track if you had the systems in place?"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Anything else — pain points, constraints, or context we should know?
                  <span className="text-slate-400 font-normal"> (optional)</span>
                </label>
                <textarea rows={3} value={text.painPoints}
                  onChange={(e) => setText((t) => ({ ...t, painPoints: e.target.value }))}
                  placeholder="Budget constraints, timeline pressures, staff concerns, political dynamics…"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {sectionIdx > 0 ? (
            <button onClick={back} type="button"
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition">
              ← Back
            </button>
          ) : (
            <a href="/intake"
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition">
              ← Back to Intake
            </a>
          )}

          {!isLastSection ? (
            <button onClick={next} type="button"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
              Next Section →
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} type="button"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Submitting…' : 'Submit Assessment ✓'}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-slate-400 text-xs mt-6">
        Your responses are confidential. This assessment takes approximately 8–12 minutes.
      </p>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading assessment…</div>
      </div>
    }>
      <AssessmentForm />
    </Suspense>
  );
}
