import Link from 'next/link'
import { hasSupabaseAdminEnv, hasSupabasePublicEnv } from '@/lib/supabase/env'

export default function SupabaseSetupPage() {
  const publicReady = hasSupabasePublicEnv()
  const adminReady = hasSupabaseAdminEnv()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Setup Required</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Connect Supabase to BTSLI</h1>
          <p className="mt-3 text-sm text-slate-600">
            The training platform is deployed, but Supabase credentials are still missing or set to placeholders.
            Add the three environment variables below in both local development and Vercel to enable auth,
            dashboards, assignments, certificates, and admin tools.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatusCard label="Public client vars" ok={publicReady} />
          <StatusCard label="Service role var" ok={adminReady} />
        </div>

        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Required variables</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            <EnvItem name="NEXT_PUBLIC_SUPABASE_URL" description="Your Supabase project URL, e.g. https://xyzcompany.supabase.co" />
            <EnvItem name="NEXT_PUBLIC_SUPABASE_ANON_KEY" description="Public anon key from Supabase Settings → API" />
            <EnvItem name="SUPABASE_SERVICE_ROLE_KEY" description="Service role key from Supabase Settings → API; server-only" />
          </ul>
        </section>

        <section className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">What to do next</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Create a Supabase project if you do not already have one.</li>
            <li>Run <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">apps/web/supabase/schema.sql</code> in the Supabase SQL editor.</li>
            <li>Add the three variables above to local <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">.env</code> and to Vercel production.</li>
            <li>Run the seed script to create demo organizations, users, modules, and sessions.</li>
            <li>Sign in with the seeded admin account and verify the dashboard, admin pages, and certificates flow.</li>
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to site
          </Link>
          <a href="https://supabase.com/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Open Supabase
          </a>
        </div>
      </div>
    </main>
  )
}

function StatusCard({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${ok ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${ok ? 'text-emerald-700' : 'text-amber-700'}`}>
        {ok ? 'Configured' : 'Missing'}
      </p>
    </div>
  )
}

function EnvItem({ name, description }: { name: string; description: string }) {
  return (
    <li className="rounded-xl border border-slate-200 p-4">
      <p className="font-mono text-xs font-semibold text-slate-900">{name}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </li>
  )
}