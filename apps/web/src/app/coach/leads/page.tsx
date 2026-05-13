'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4100';

const RISK_COLORS: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-purple-100 text-purple-700',
  ASSESSMENT_SENT: 'bg-orange-100 text-orange-700',
  BOOKED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-500',
};

const URGENCY_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-600 font-bold',
  HIGH: 'text-orange-600 font-semibold',
  MEDIUM: 'text-blue-600',
  LOW: 'text-slate-500',
};

type Lead = {
  id: string;
  createdAt: string;
  orgName: string;
  contactName: string;
  contactEmail: string;
  role: string;
  orgType: string;
  teamSize: string;
  mainChallenge: string;
  urgencyLevel: string;
  budgetRange: string;
  leadScore: number;
  suggestedPath: string | null;
  status: string;
  challengeTags: string[];
  assessment: { totalScore: number; weakestAreas: string[]; createdAt: string } | null;
  briefing: { recommendedService: string; riskLevel: string } | null;
};

type LeadDetail = Lead & {
  whatIsBreaking: string;
  desiredOutcome: string;
  departmentsInvolved: string[];
  currentSystems: string[];
  preferredTime: string | null;
  additionalNotes: string | null;
  assessment: any;
  briefing: any;
};

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 3.5 ? 'bg-emerald-500' : score >= 2.5 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-8">{score.toFixed(1)}</span>
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<LeadDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    fetch(`${API_BASE}/intake/leads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized — coach or admin access required');
        return r.json();
      })
      .then(setLeads)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function openDetail(id: string) {
    setDetailLoading(true);
    const token = localStorage.getItem('token') ?? '';
    try {
      const res = await fetch(`${API_BASE}/intake/lead/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not load lead');
      setSelected(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDetailLoading(false);
    }
  }

  const filtered = leads.filter((l) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      l.orgName.toLowerCase().includes(q) ||
      l.contactName.toLowerCase().includes(q) ||
      l.mainChallenge.toLowerCase().includes(q) ||
      (l.suggestedPath ?? '').toLowerCase().includes(q) ||
      l.status.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading leads…</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Intake Dashboard</h1>
          <p className="text-slate-500 text-sm">{leads.length} total leads · {leads.filter((l) => l.assessment).length} completed assessments</p>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by org, challenge, path…"
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>
      )}

      {/* Leads table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Organization</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Challenge</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Urgency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Path</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Assessment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">No leads found</td>
                </tr>
              )}
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{lead.orgName}</div>
                    <div className="text-slate-400 text-xs">{lead.contactName}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-slate-600 truncate">{lead.mainChallenge}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lead.challengeTags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${URGENCY_COLORS[lead.urgencyLevel] ?? ''}`}>
                      {lead.urgencyLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-24">
                    <div className="text-xs text-slate-500 mb-1">Lead: {lead.leadScore}/100</div>
                    {lead.assessment && (
                      <ScoreBar score={lead.assessment.totalScore} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {lead.suggestedPath ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {lead.assessment ? (
                      <div>
                        <span className="text-xs text-emerald-600 font-semibold">✓ Complete</span>
                        {lead.briefing && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded border ${RISK_COLORS[lead.briefing.riskLevel] ?? ''}`}>
                            {lead.briefing.riskLevel}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openDetail(lead.id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition">
                      View Brief
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading && (
              <div className="flex items-center justify-center h-32 text-slate-400">Loading…</div>
            )}
            {selected && !detailLoading && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selected.orgName}</h2>
                    <p className="text-slate-500 text-sm">{selected.contactName} · {selected.role} · <a href={`mailto:${selected.contactEmail}`} className="text-blue-600">{selected.contactEmail}</a></p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">Lead Score</div>
                    <div className="text-2xl font-bold text-blue-600">{selected.leadScore}</div>
                    <div className="text-xs text-slate-400">/ 100</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">Urgency</div>
                    <div className={`text-lg font-bold ${URGENCY_COLORS[selected.urgencyLevel] ?? ''}`}>{selected.urgencyLevel}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">Budget</div>
                    <div className="text-sm font-bold text-slate-700">{selected.budgetRange.replace(/_/g, ' ')}</div>
                  </div>
                </div>

                {/* Briefing */}
                {selected.briefing && (
                  <div className="space-y-4 mb-6">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold ${RISK_COLORS[selected.briefing.riskLevel] ?? ''}`}>
                      Risk Level: {selected.briefing.riskLevel}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Client Summary</h3>
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{selected.briefing.clientSummary}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Recommended Service</h3>
                      <p className="text-sm font-semibold text-blue-700 bg-blue-50 p-3 rounded-lg">{selected.briefing.recommendedService}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">Likely Root Causes</h3>
                      <ul className="space-y-1.5">
                        {selected.briefing.likelyRootCauses?.map((c: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-orange-500">•</span>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">Suggested Questions to Ask</h3>
                      <ol className="space-y-2">
                        {selected.briefing.suggestedQuestions?.map((q: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2">
                            <span className="text-blue-500 font-bold flex-shrink-0">{i + 1}.</span>{q}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">Draft KPIs</h3>
                      <ul className="space-y-1">
                        {selected.briefing.draftKpis?.map((k: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-emerald-500">✓</span>{k}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Draft Follow-Up Email</h3>
                      <pre className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg whitespace-pre-wrap font-sans">
                        {selected.briefing.draftFollowUpEmail}
                      </pre>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Draft Proposal Angle</h3>
                      <pre className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg whitespace-pre-wrap font-sans">
                        {selected.briefing.draftProposalAngle}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Assessment snapshot */}
                {selected.assessment && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Systems Snapshot</h3>
                    <pre className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg whitespace-pre-wrap font-mono">
                      {selected.assessment.systemsSnapshot}
                    </pre>
                  </div>
                )}

                {/* Intake details */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-700">Intake Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400">Org Type: </span><span className="text-slate-700">{selected.orgType}</span></div>
                    <div><span className="text-slate-400">Team: </span><span className="text-slate-700">{selected.teamSize}</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">Main Challenge</div>
                    <p className="text-sm text-slate-700">{selected.mainChallenge}</p>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">What&apos;s Breaking Down</div>
                    <p className="text-sm text-slate-700">{selected.whatIsBreaking}</p>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">Desired Outcome</div>
                    <p className="text-sm text-slate-700">{selected.desiredOutcome}</p>
                  </div>
                  {selected.additionalNotes && (
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Additional Notes</div>
                      <p className="text-sm text-slate-700">{selected.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
