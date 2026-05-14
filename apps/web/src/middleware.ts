import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth'

const PROTECTED_ROUTES = ['/dashboard', '/app', '/coach']
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  let user = null

  if (token) {
    try {
      user = await verifyAuthToken(token)
    } catch {
      user = null
    }
  }

  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (AUTH_ROUTES.includes(pathname) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (!token && request.nextUrl.pathname === '/setup/supabase') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
