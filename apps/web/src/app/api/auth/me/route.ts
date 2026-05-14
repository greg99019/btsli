import { NextRequest, NextResponse } from 'next/server'
import { getRequestToken, verifyAuthToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = getRequestToken(request)
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await verifyAuthToken(token)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
