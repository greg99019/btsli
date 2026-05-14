import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET not set');
  return new TextEncoder().encode(s);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ sub: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getSecret());

    return NextResponse.json({ token, role: user.role, name: user.name });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[auth/login POST]', message);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
