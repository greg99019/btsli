import { jwtVerify, SignJWT } from 'jose'
import type { NextRequest } from 'next/server'

export const AUTH_COOKIE_NAME = 'btsli_token'

export type AuthRole = 'CLIENT' | 'COACH' | 'ORG_ADMIN' | 'SUPER_ADMIN'

export interface AuthUser {
  id: string
  email: string
  role: AuthRole
  name?: string
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

export async function signAuthToken(user: AuthUser) {
  return new SignJWT({ email: user.email, role: user.role, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyAuthToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, getSecret())

  return {
    id: String(payload.sub ?? ''),
    email: String(payload.email ?? ''),
    role: String(payload.role ?? 'CLIENT') as AuthRole,
    name: payload.name ? String(payload.name) : undefined,
  }
}

export function getRequestToken(request: NextRequest) {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? bearer ?? null
}
