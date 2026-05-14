const PLACEHOLDER_MARKERS = ['YOUR_PROJECT', 'YOUR_ANON_KEY', 'YOUR_SERVICE_ROLE_KEY']

function isMissing(value: string | undefined) {
  if (!value) return true
  return PLACEHOLDER_MARKERS.some(marker => value.includes(marker))
}

export function hasSupabasePublicEnv() {
  return !isMissing(process.env.NEXT_PUBLIC_SUPABASE_URL) && !isMissing(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function hasSupabaseAdminEnv() {
  return hasSupabasePublicEnv() && !isMissing(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isMissing(url) || isMissing(anonKey)) {
    throw new Error(
      'Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in local .env and Vercel.'
    )
  }

  return { url, anonKey }
}

export function getSupabaseAdminEnv() {
  const { url, anonKey } = getSupabasePublicEnv()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (isMissing(serviceRoleKey)) {
    throw new Error(
      'Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY in local .env and Vercel.'
    )
  }

  return { url, anonKey, serviceRoleKey }
}