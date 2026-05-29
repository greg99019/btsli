'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = '';

const ORG_TYPES = [
  { value: 'NONPROFIT', label: 'Nonprofit Organization' },
  { value: 'GOVERNMENT', label: 'Government Agency' },
  { value: 'CORPORATE', label: 'Corporate / Enterprise' },
  { value: 'SMALL_BUSINESS', label: 'Small Business' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'OTHER', label: 'Other' },
];

const TEAM_SIZES = ['1–10', '11–25', '26–50', '51–200', '200+'];

const DEPARTMENTS = [
  'Leadership / Executive', 'Operations', 'HR / People & Culture',
  'Finance / Administration', 'Programs / Direct Services',
  'Sales / Outreach / Development', 'IT / Technology', 'Other',
];

const CURRENT_SYSTEMS = [
  'Project Management Tools', 'CRM / Client Management',
  'HR / Onboarding System', 'Training Programs',
  'SOPs / Process Documentation', 'Performance Tracking',
  'Communication Platforms', 'None of the above',
];

const URGENCY_LEVELS = [
  { value: 'LOW', label: 'Low', desc: 'We can take 3–6 months' },
  { value: 'MEDIUM', label: 'Medium', desc: 'We need movement in 1–3 months' },
  { value: 'HIGH', label: 'High', desc: 'This is affecting us now' },
  { value: 'CRITICAL', label: 'Critical', desc: 'This is a crisis-level problem' },
];

const BUDGET_RANGES = [
  { value: 'UNDER_5K', label: 'Under $5,000' },
  { value: 'FIVE_TO_15K', label: '$5,000 – $15,000' },
  { value: 'FIFTEEN_TO_30K', label: '$15,000 – $30,000' },
  { value: 'THIRTY_TO_60K', label: '$30,000 – $60,000' },
  { value: 'OVER_60K', label: 'Over $60,000' },
  { value: 'NOT_SURE', label: 'Not sure yet' },
];

const PREFERRED_TIMES = [
  'Early morning (8–10 am)', 'Morning (10 am–12 pm)',
  'Afternoon (12–3 pm)', 'Late afternoon (3–5 pm)', 'Flexible',
];

const STEPS = [
  'Your Organization',
  'Current State',
  'Goals & Constraints',
  'Next Steps',
];

type FormData = {
  orgName: string; contactName: string; contactEmail: string;
  contactPhone: string; role: string; orgType: string; teamSize: string;
  departmentsInvolved: string[];
  mainChallenge: string; whatIsBreaking: string; currentSystems: string[];
  desiredOutcome: string; urgencyLevel: string; budgetRange: string;
  preferredTime: string[]; additionalNotes: string; consent: boolean;
};

const initial: FormData = {
  orgName: '', contactName: '', contactEmail: '', contactPhone: '',
  role: '', orgType: '', teamSize: '', departmentsInvolved: [],
  mainChallenge: '', whatIsBreaking: '', currentSystems: [],
  desiredOutcome: '', urgencyLevel: '', budgetRange: '',
  preferredTime: [], additionalNotes: '', consent: false,
};

function toggleArray(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      {...props}
      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const { options, ...rest } = props;
  return (
    <select
      {...rest}
      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function CheckGroup({
  options, selected, onChange,
}: { options: string[]; selected: string[]; onChange: (val: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <label key={opt}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition ${
            selected.includes(opt)
              ? 'border-blue-500 bg-blue-50 text-blue-800'
              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
          }`}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onChange(opt)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroup({
  options, value, onChange,
}: { options: { value: string; label: string; desc?: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => (
        <label key={opt.value}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer transition ${
            value === opt.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-blue-300'
          }`}>
          <input
            type="radio"
            name="radio"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-0.5 accent-blue-600"
          />
          <div>
            <div className={`text-sm font-semibold ${value === opt.value ? 'text-blue-800' : 'text-slate-700'}`}>
              {opt.label}
            </div>
            {opt.desc && <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  function validate(s: number): boolean {
    const e: typeof errors = {};
    if (s === 0) {
      if (!form.orgName.trim()) e.orgName = 'Required';
      if (!form.contactName.trim()) e.contactName = 'Required';
      if (!form.contactEmail.trim()) e.contactEmail = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
        e.contactEmail = 'Enter a valid email';
      if (!form.role.trim()) e.role = 'Required';
      if (!form.orgType) e.orgType = 'Required';
      if (!form.teamSize) e.teamSize = 'Required';
    }
    if (s === 1) {
      if (!form.mainChallenge.trim()) e.mainChallenge = 'Required';
      if (!form.whatIsBreaking.trim()) e.whatIsBreaking = 'Required';
    }
    if (s === 2) {
      if (!form.desiredOutcome.trim()) e.desiredOutcome = 'Required';
      if (!form.urgencyLevel) e.urgencyLevel = 'Required';
      if (!form.budgetRange) e.budgetRange = 'Required';
    }
    if (s === 3) {
      if (!form.consent) e.consent = 'You must agree to be contacted';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => s - 1);
    setErrors({});
  }

  async function submit() {
    if (!validate(step)) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        ...form,
        teamSize: form.teamSize,
      };
      const res = await fetch(`${API_BASE}/api/intake/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const { id } = await res.json();
      router.push(`/intake/confirmation?leadId=${id}`);
    } catch (err: any) {
      setSubmitError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
          Initial Review · Institutional Intake
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          Start with a Systems Fit Assessment
        </h1>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">
          Tell us where your organization is experiencing friction. We&apos;ll review your responses
          and identify the systems, workflows, service scope, or support structures that may need strengthening.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                i < step ? 'bg-blue-600 text-white'
                : i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : 'bg-slate-200 text-slate-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 hidden sm:block text-center ${
                i <= step ? 'text-blue-700 font-medium' : 'text-slate-400'
              }`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">

        {/* Step 0: Organization */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-slate-800 mb-1">About Your Organization</h2>
            <p className="text-slate-500 text-sm mb-4">Help us understand who you are and what you do.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Organization Name</Label>
                <Input value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="Your organization" />
                {errors.orgName && <p className="text-red-500 text-xs mt-1">{errors.orgName}</p>}
              </div>
              <div>
                <Label required>Your Full Name</Label>
                <Input value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="First and last name" />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Email Address</Label>
                <Input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="you@org.com" />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="(Optional)" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Your Role / Title</Label>
                <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Executive Director, CEO" />
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>
              <div>
                <Label required>Type of Organization</Label>
                <Select
                  value={form.orgType}
                  onChange={(e) => set('orgType', e.target.value)}
                  options={ORG_TYPES}
                />
                {errors.orgType && <p className="text-red-500 text-xs mt-1">{errors.orgType}</p>}
              </div>
            </div>

            <div>
              <Label required>Team Size</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_SIZES.map((s) => (
                  <button key={s} type="button"
                    onClick={() => set('teamSize', s)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      form.teamSize === s
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-300 text-slate-600 hover:border-blue-400'
                    }`}>{s}</button>
                ))}
              </div>
              {errors.teamSize && <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>}
            </div>

            <div>
              <Label>Departments Involved <span className="font-normal text-slate-400">(select all that apply)</span></Label>
              <CheckGroup
                options={DEPARTMENTS}
                selected={form.departmentsInvolved}
                onChange={(v) => set('departmentsInvolved', toggleArray(form.departmentsInvolved, v))}
              />
            </div>
          </div>
        )}

        {/* Step 1: Current State */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Current State</h2>
            <p className="text-slate-500 text-sm mb-4">Be as specific as you can — this helps us prepare a more useful review and engagement recommendation.</p>

            <div>
              <Label required>What is your main challenge?</Label>
              <Textarea
                value={form.mainChallenge}
                onChange={(e) => set('mainChallenge', e.target.value)}
                placeholder="Describe the primary challenge your organization is facing…"
              />
              {errors.mainChallenge && <p className="text-red-500 text-xs mt-1">{errors.mainChallenge}</p>}
            </div>

            <div>
              <Label required>What is currently breaking down?</Label>
              <Textarea
                value={form.whatIsBreaking}
                onChange={(e) => set('whatIsBreaking', e.target.value)}
                placeholder="What specific systems, processes, or behaviors are failing or inconsistent?"
              />
              {errors.whatIsBreaking && <p className="text-red-500 text-xs mt-1">{errors.whatIsBreaking}</p>}
            </div>

            <div>
              <Label>What systems are currently in place? <span className="font-normal text-slate-400">(select all that apply)</span></Label>
              <CheckGroup
                options={CURRENT_SYSTEMS}
                selected={form.currentSystems}
                onChange={(v) => set('currentSystems', toggleArray(form.currentSystems, v))}
              />
            </div>
          </div>
        )}

        {/* Step 2: Goals & Constraints */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Goals &amp; Constraints</h2>
            <p className="text-slate-500 text-sm mb-4">Help us understand where you want to go and what constraints we should plan around.</p>

            <div>
              <Label required>What does your desired outcome look like?</Label>
              <Textarea
                value={form.desiredOutcome}
                onChange={(e) => set('desiredOutcome', e.target.value)}
                placeholder="What would success look like 3–6 months from now?"
              />
              {errors.desiredOutcome && <p className="text-red-500 text-xs mt-1">{errors.desiredOutcome}</p>}
            </div>

            <div>
              <Label required>How urgent is this?</Label>
              <RadioGroup
                options={URGENCY_LEVELS}
                value={form.urgencyLevel}
                onChange={(v) => set('urgencyLevel', v)}
              />
              {errors.urgencyLevel && <p className="text-red-500 text-xs mt-1">{errors.urgencyLevel}</p>}
            </div>

            <div>
              <Label required>Budget readiness</Label>
              <p className="text-xs text-slate-400 mb-2">This helps us recommend the right engagement scope. All options are on the table.</p>
              <RadioGroup
                options={BUDGET_RANGES}
                value={form.budgetRange}
                onChange={(v) => set('budgetRange', v)}
              />
              {errors.budgetRange && <p className="text-red-500 text-xs mt-1">{errors.budgetRange}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Next Steps */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Next Steps</h2>
            <p className="text-slate-500 text-sm mb-4">Help us coordinate follow-up and prepare for the right next-step conversation.</p>

            <div>
              <Label>Preferred times for a follow-up consultation <span className="font-normal text-slate-400">(select all that work)</span></Label>
              <CheckGroup
                options={PREFERRED_TIMES}
                selected={form.preferredTime}
                onChange={(v) => set('preferredTime', toggleArray(form.preferredTime as string[], v))}
              />
            </div>

            <div>
              <Label>Anything else you&apos;d like us to know?</Label>
              <Textarea
                value={form.additionalNotes}
                onChange={(e) => set('additionalNotes', e.target.value)}
                placeholder="Optional — any context that would help us prepare…"
                rows={3}
              />
            </div>

            <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
              form.consent ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
            }`}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set('consent', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-slate-700">
                I agree to be contacted by BTSLI™ regarding my assessment, service fit review, and consultation.
                I understand my information will be used solely to prepare for follow-up and will not be sold
                or shared with third parties.
              </span>
            </label>
            {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 0 ? (
            <button onClick={back} type="button"
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition">
              ← Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button onClick={next} type="button"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
              Continue →
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} type="button"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Submitting…' : 'Submit for Review'}
            </button>
          )}
        </div>
      </div>

      {/* Trust note */}
      <p className="text-center text-slate-400 text-xs mt-6">
        Your information is confidential and used only to prepare your review and follow-up consultation.
        BTSLI™ is a WOSB &amp; EDWOSB certified firm.
      </p>
    </div>
  );
}
