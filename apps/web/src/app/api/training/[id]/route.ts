import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getRequestToken(req)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await verifyAuthToken(token)

  const [mod, progress] = await Promise.all([
    prisma.trainingModule.findUnique({
      where: { id: params.id, isPublished: true },
      include: { questions: { orderBy: { orderIdx: 'asc' }, include: { choices: { select: { id: true, text: true } } } } },
    }),
    prisma.moduleProgress.findUnique({ where: { userId_moduleId: { userId: user.id, moduleId: params.id } } }),
  ])

  if (!mod) return NextResponse.json({ message: 'Module not found' }, { status: 404 })

  return NextResponse.json({ module: mod, progress })
}
