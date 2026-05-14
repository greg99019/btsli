'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Training module data ──────────────────────────────────────────────────────

const TRAINING_MODULES = [
  {
    id: 1,
    title: 'Workplace Orientation & Platform Overview',
    description: 'Get oriented to the learning portal, understand your assigned modules, and set expectations for the training cycle.',
    duration: '12:00',
    category: 'Getting Started',
    progress: 100,
    status: 'Completed',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 312,
    required: true,
  },
  {
    id: 2,
    title: 'Effective Workplace Communication',
    description: 'Build stronger communication habits that improve clarity, accountability, and team performance across departments.',
    duration: '15:20',
    category: 'Communication',
    progress: 65,
    status: 'In Progress',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 1567,
    required: true,
  },
  {
    id: 3,
    title: 'Standard Operating Procedures: Building & Using SOPs',
    description: 'Learn how to create, maintain, and follow SOPs that reduce inconsistency and reliance on institutional memory.',
    duration: '18:45',
    category: 'Standard Operating Procedures',
    progress: 30,
    status: 'In Progress',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 894,
    required: true,
  },
  {
    id: 4,
    title: 'Accountability Structures That Work',
    description: 'Establish individual and team accountability habits that drive follow-through and measurable results.',
    duration: '14:10',
    category: 'Accountability & Follow-Through',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 723,
    required: true,
  },
  {
    id: 5,
    title: 'Leadership Fundamentals for Supervisors',
    description: 'Core competencies for supervisors and department leads: delegation, feedback, team development, and performance coaching.',
    duration: '22:30',
    category: 'Leadership & Supervision',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 1129,
    required: false,
  },
  {
    id: 6,
    title: 'Team Collaboration & Cross-Department Coordination',
    description: 'Practical tools for improving handoffs, shared priorities, and collaborative problem-solving across teams.',
    duration: '11:50',
    category: 'Team Collaboration',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 645,
    required: false,
  },
  {
    id: 7,
    title: 'Workplace Systems: Diagnosing & Strengthening Operations',
    description: 'Identify operational gaps, apply a systems-thinking lens to persistent problems, and build more reliable workflows.',
    duration: '19:00',
    category: 'Workplace Systems',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 501,
    required: false,
  },
  {
    id: 8,
    title: 'Client & Customer Service Excellence',
    description: "Deliver consistent, professional service experiences that reflect your organization's values and standards.",
    duration: '13:30',
    category: 'Client/Customer Service',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 410,
    required: false,
  },
  {
    id: 9,
    title: 'Compliance & Workplace Safety Essentials',
    description: "Understand your organization's compliance obligations, safety protocols, and reporting responsibilities.",
    duration: '16:15',
    category: 'Compliance & Safety',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 788,
    required: false,
  },
  {
    id: 10,
    title: 'Performance Improvement Planning',
    description: 'Navigate performance gaps constructively — create actionable plans that support growth and system alignment.',
    duration: '17:40',
    category: 'Performance Improvement',
    progress: 0,
    status: 'Not Started',
    facilitator: 'BTSLI Consulting Team',
    participantsCompleted: 334,
    required: false,
  },
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Workplace Systems',
  'Communication',
  'Leadership & Supervision',
  'Standard Operating Procedures',
  'Accountability & Follow-Through',
  'Client/Customer Service',
  'Compliance & Safety',
  'Team Collaboration',
  'Performance Improvement',
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Getting Started':                 { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Workplace Systems':               { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  'Communication':                   { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Leadership & Supervision':        { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  'Standard Operating Procedures':   { bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-500' },
  'Accountability & Follow-Through': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Client/Customer Service':         { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  'Compliance & Safety':             { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  'Team Collaboration':              { bg: 'bg-cyan-100',   text: 'text-cyan-700',   dot: 'bg-cyan-500' },
  'Performance Improvement':         { bg: 'bg-rose-100',   text: 'text-rose-700',   dot: 'bg-rose-500' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTrainingCycle() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  let label = '';
  let end = new Date();
  if (m <= 4)      { label = `Spring ${y}`;  end = new Date(y, 4, 31); }
  else if (m <= 7) { label = `Summer ${y}`;  end = new Date(y, 7, 31); }
  else             { label = `Fall ${y}`;    end = new Date(y, 11, 15); }
  const days = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
  return { label, daysRemaining: days };
}

function progressBarColor(p: number) {
  if (p >= 100) return 'bg-emerald-500';
  if (p >= 50)  return 'bg-blue-500';
  if (p > 0)    return 'bg-amber-500';
  return 'bg-slate-200';
}

function statusBadge(status: string) {
  if (status === 'Completed')   return 'bg-emerald-100 text-emerald-700';
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-500';
}

function actionLabel(status: string) {
  if (status === 'Completed')   return 'Review Training';
  if (status === 'In Progress') return 'Continue Training';
  return 'Start Training';
}

function actionStyle(status: string) {
  if (status === 'Completed')   return 'border border-slate-300 text-slate-600 hover:bg-slate-50';
  if (status === 'In Progress') return 'bg-blue-600 text-white hover:bg-blue-700';
  return 'bg-slate-800 text-white hover:bg-slate-900';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [tab, setTab] = useState<'library' | 'assigned'>('library');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { label: cycleName, daysRemaining } = getTrainingCycle();

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        } else {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserName(payload.name ?? payload.email ?? 'Participant');
          } catch {
            setUserName('Participant');
          }
        }
      })
      .catch(() => {
        try {
          const token2 = localStorage.getItem('token') ?? '';
          const payload = JSON.parse(atob(token2.split('.')[1]));
          setUserName(payload.name ?? payload.email ?? 'Participant');
        } catch {
          setUserName('Participant');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const completed    = TRAINING_MODULES.filter(m => m.status === 'Completed');
  const inProgress   = TRAINING_MODULES.filter(m => m.status === 'In Progress');
  const required     = TRAINING_MODULES.filter(m => m.required);
  const optional     = TRAINING_MODULES.filter(m => !m.required);
  const totalModules = TRAINING_MODULES.length;
  const overallPct   = Math.round(
    TRAINING_MODULES.reduce((sum, m) => sum + m.progress, 0) / totalModules,
  );
  const actionItems = required.filter(m => m.status !== 'Completed').length;

  const filtered = TRAINING_MODULES.filter(m => {
    const matchCat  = category === 'All' || m.category === category;
    const matchText =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  const featuredModule =
    TRAINING_MODULES.find(m => m.status === 'In Progress') ?? TRAINING_MODULES[0];
  const featColors =
    CATEGORY_COLORS[featuredModule.category] ?? { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {cycleName} Training Cycle
              {daysRemaining > 0 ? (
                <span className="ml-2 text-amber-600 font-medium">· {daysRemaining} days remaining</span>
              ) : (
                <span className="ml-2 text-red-600 font-medium">· Cycle ended</span>
              )}
            </p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Welcome banner ── */}
        <div className="bg-slate-800 text-white rounded-2xl px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{cycleName} Training Cycle</p>
            <h2 className="text-2xl font-bold">Welcome back, {userName}!</h2>
            <p className="text-slate-300 mt-1 text-sm">
              {actionItems > 0
                ? `You have ${actionItems} required action item${actionItems !== 1 ? 's' : ''} remaining.`
                : 'All required training is complete. Great work.'}
            </p>
          </div>
          <div className="flex-shrink-0 text-center sm:text-right">
            <p className="text-4xl font-black text-white">{overallPct}%</p>
            <p className="text-slate-400 text-xs mt-0.5">Overall Progress</p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Modules',    value: totalModules,      color: 'text-slate-800' },
            { label: 'Completed',        value: completed.length,  color: 'text-emerald-600' },
            { label: 'In Progress',      value: inProgress.length, color: 'text-blue-600' },
            { label: 'Overall Progress', value: `${overallPct}%`,  color: 'text-slate-800' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── Workplace Training Library ── */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Workplace Training Library</h2>
                <p className="text-sm text-slate-500 mt-0.5">Essential skills for stronger workplace systems</p>

                {/* Search */}
                <div className="relative mt-4">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search training modules…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        category === cat
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured module – shown only when not filtering */}
              {!search && category === 'All' && (
                <div className="mx-6 mt-6 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Featured Module</span>
                    <span className="text-xs text-amber-400 font-semibold">{featuredModule.status}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${featColors.bg} ${featColors.text}`}>
                            {featuredModule.category}
                          </span>
                          <span className="text-xs text-slate-400">{featuredModule.duration}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">{featuredModule.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{featuredModule.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span>Facilitator: <span className="font-medium text-slate-700">{featuredModule.facilitator}</span></span>
                          <span>{featuredModule.participantsCompleted.toLocaleString()} participants completed</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-500">Progress</span>
                            <span className="text-xs font-bold text-slate-700">{featuredModule.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full">
                            <div
                              className={`h-2 rounded-full transition-all ${progressBarColor(featuredModule.progress)}`}
                              style={{ width: `${featuredModule.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        {actionLabel(featuredModule.status)}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Module list */}
              <div className="divide-y divide-slate-100 mt-4 mb-2">
                {filtered.length === 0 ? (
                  <div className="px-6 py-10 text-center text-slate-500 text-sm">
                    No training modules match your search.
                  </div>
                ) : (
                  filtered.map(mod => {
                    const colors =
                      CATEGORY_COLORS[mod.category] ?? { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
                    const isExpanded = expandedId === mod.id;
                    return (
                      <div key={mod.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                {mod.category}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge(mod.status)}`}>
                                {mod.status}
                              </span>
                              {mod.required && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-white">
                                  Required
                                </span>
                              )}
                              <span className="text-xs text-slate-400">{mod.duration}</span>
                            </div>
                            <button className="text-left" onClick={() => setExpandedId(isExpanded ? null : mod.id)}>
                              <h3 className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors">
                                {mod.title}
                              </h3>
                            </button>
                            {isExpanded && (
                              <div className="mt-2 space-y-1.5">
                                <p className="text-sm text-slate-600">{mod.description}</p>
                                <p className="text-xs text-slate-500">
                                  Facilitator:{' '}
                                  <span className="font-medium text-slate-700">{mod.facilitator}</span>
                                  <span className="mx-2">·</span>
                                  {mod.participantsCompleted.toLocaleString()} participants completed
                                </p>
                              </div>
                            )}
                            {mod.progress > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-200 rounded-full">
                                  <div
                                    className={`h-1.5 rounded-full ${progressBarColor(mod.progress)}`}
                                    style={{ width: `${mod.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-500 font-medium w-8 text-right">{mod.progress}%</span>
                              </div>
                            )}
                          </div>
                          <button
                            className={`flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${actionStyle(mod.status)}`}
                          >
                            {actionLabel(mod.status)}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* ── Organization Learning Portal ── */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Organization Learning Portal</h2>
                <p className="text-sm text-slate-500 mt-0.5">Browse and manage your assigned workplace trainings.</p>
                <div className="flex gap-1 mt-4 border border-slate-200 rounded-lg p-0.5 w-fit">
                  {(['library', 'assigned'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        tab === t ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {t === 'library' ? 'All Modules' : 'My Assigned'}
                    </button>
                  ))}
                </div>
              </div>

              {tab === 'assigned' ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-slate-700 mb-2">No Training Assigned Yet</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    You have not been assigned any training modules yet. Contact your administrator or consultant to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {TRAINING_MODULES.map(mod => {
                    const colors =
                      CATEGORY_COLORS[mod.category] ?? { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
                    return (
                      <div key={mod.id} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            mod.status === 'Completed'
                              ? 'bg-emerald-500'
                              : mod.status === 'In Progress'
                              ? 'bg-blue-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{mod.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                              {mod.category}
                            </span>
                            <span className="text-xs text-slate-400">{mod.duration}</span>
                          </div>
                        </div>
                        {mod.progress > 0 && (
                          <span className="text-xs font-semibold text-slate-600 flex-shrink-0">{mod.progress}%</span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusBadge(mod.status)}`}>
                          {mod.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* In-progress */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">In-Progress Modules</h3>
              </div>
              {inProgress.length === 0 ? (
                <p className="px-5 py-4 text-xs text-slate-500">No modules in progress.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {inProgress.map(mod => (
                    <div key={mod.id} className="px-5 py-3">
                      <p className="text-xs font-semibold text-slate-800 mb-1.5 line-clamp-2">{mod.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${mod.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{mod.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Required trainings */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Required Trainings</h3>
                <span className="text-xs font-semibold text-slate-500">
                  {required.filter(m => m.status === 'Completed').length}/{required.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {required.map(mod => (
                  <div key={mod.id} className="px-5 py-3 flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                        mod.status === 'Completed' ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}
                    >
                      {mod.status === 'Completed' ? (
                        <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium line-clamp-2 ${
                          mod.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {mod.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certificates */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Certificates Earned</h3>
              </div>
              {completed.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-xs text-slate-500">
                    Complete a required training module to earn your first certificate.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {completed.map(mod => (
                    <div key={mod.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{mod.title}</p>
                        <p className="text-xs text-slate-400">{mod.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Optional resources */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Optional Resources</h3>
                <p className="text-xs text-slate-500 mt-0.5">Additional modules to deepen your skills</p>
              </div>
              <div className="divide-y divide-slate-100">
                {optional.slice(0, 4).map(mod => {
                  const colors =
                    CATEGORY_COLORS[mod.category] ?? { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
                  return (
                    <div key={mod.id} className="px-5 py-3 flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 line-clamp-1">{mod.title}</p>
                        <p className="text-xs text-slate-400">{mod.duration}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>

        {/* ── Announcements + Upcoming live sessions ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Announcements */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Recent Announcements</h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Welcome to the {cycleName} Training Cycle!
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Your organization's training portal is now active. Assigned participants can complete required modules, track progress, and access workplace resources.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">BTSLI Consulting Team · Today</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Required Modules Deadline</p>
                    <p className="text-xs text-slate-500 mt-1">
                      All required training modules must be completed before the end of the {cycleName} cycle.
                      {daysRemaining > 0
                        ? ` You have ${daysRemaining} days remaining.`
                        : ' The cycle has ended.'}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">BTSLI Consulting Team · This cycle</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming live sessions */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Upcoming Live Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Scheduled check-ins and facilitated sessions</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  title: 'Leadership & Accountability Check-In',
                  date: 'May 20, 2026',
                  time: '10:00 AM EST',
                  type: 'Live Session',
                  color: 'bg-amber-100 text-amber-700',
                },
                {
                  title: 'SOP Workshop: Documenting Core Processes',
                  date: 'May 27, 2026',
                  time: '2:00 PM EST',
                  type: 'Workshop',
                  color: 'bg-teal-100 text-teal-700',
                },
                {
                  title: 'Quarterly Systems Review',
                  date: 'Jun 3, 2026',
                  time: '11:00 AM EST',
                  type: 'Check-In',
                  color: 'bg-blue-100 text-blue-700',
                },
              ].map(session => (
                <div key={session.title} className="px-6 py-4 flex items-center gap-4">
                  <div className="text-center flex-shrink-0 w-12">
                    <p className="text-xl font-black text-slate-800 leading-none">
                      {session.date.split(' ')[1].replace(',', '')}
                    </p>
                    <p className="text-xs text-slate-500">{session.date.split(' ')[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{session.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${session.color}`}>
                        {session.type}
                      </span>
                      <span className="text-xs text-slate-400">{session.time}</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    RSVP
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
