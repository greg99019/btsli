import { createBrowserClient } from '@supabase/ssr'

const PLACEHOLDER_MARKERS = ['YOUR_PROJECT', 'YOUR_ANON_KEY']

function isMissing(value: string | undefined) {
  if (!value) return true
  return PLACEHOLDER_MARKERS.some(marker => value.includes(marker))
}

function createMissingEnvClient() {
  const message =
    'Supabase environment variables are not configured. Visit /setup/supabase and add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.'

  const handler: ProxyHandler<(...args: unknown[]) => unknown> = {
    get(_, prop) {
      if (prop === 'then') return undefined
      if (prop === Symbol.toStringTag) return 'MissingSupabaseClient'
      return new Proxy(() => undefined, handler)
    },
    apply() {
      throw new Error(message)
    },
  }

  return new Proxy(() => undefined, handler) as ReturnType<typeof createBrowserClient>
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isMissing(url) || isMissing(anonKey)) {
    return createMissingEnvClient()
  }

  return createBrowserClient(
    url,
    anonKey
  )
}
