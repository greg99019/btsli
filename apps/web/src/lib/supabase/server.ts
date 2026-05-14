import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getSupabaseAdminEnv, getSupabasePublicEnv } from './env'

export function createClient() {
  const cookieStore = cookies()
  const { url, anonKey } = getSupabasePublicEnv()
  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component; session refresh happens in middleware
          }
        },
      },
    }
  )
}

// Service-role client — bypasses RLS, use only in trusted server code
export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminEnv()
  return createSupabaseAdminClient(
    url,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
