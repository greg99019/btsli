import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasSupabasePublicEnv } from '@/lib/supabase/env'

const PLATFORM_ROUTES = ['/dashboard', '/training', '/progress', '/certificates', '/schedule', '/admin']
const AUTH_ROUTES = ['/login', '/reset-password', '/update-password']
const ADMIN_ROLES = ['super_admin', 'consultant', 'org_admin', 'manager']
const SETUP_ROUTE = '/setup/supabase'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!hasSupabasePublicEnv()) {
    if (!pathname.startsWith(SETUP_ROUTE) && !pathname.startsWith('/_next') && pathname !== '/favicon.ico') {
      const url = request.nextUrl.clone()
      url.pathname = SETUP_ROUTE
      return NextResponse.redirect(url)
    }

    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect platform routes from unauthenticated users
  if (PLATFORM_ROUTES.some(r => pathname.startsWith(r)) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protect admin routes by role
  if (pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !ADMIN_ROLES.includes(profile.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
