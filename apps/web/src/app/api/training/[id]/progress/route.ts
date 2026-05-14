import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getRequestToken(req)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await verifyAuthToken(token)

  const { watchedPct, lastSecond } = await req.json()

  const mod = await prisma.trainingModule.findUnique({ where: { id: params.id }, select: { minWatchPct: true, isRequired: true, _count: { select: { questions: true } } } })
  if (!mod) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  const hasQuiz = mod._count.questions > 0
  const videoComplete = (watchedPct ?? 0) >= mod.minWatchPct
  const completed = videoComplete && !hasQuiz

  const progress = await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId: params.id } },
    create: { userId: user.id, moduleId: params.id, watchedPct: watchedPct ?? 0, lastSecond: lastSecond ?? 0, completed, completedAt: completed ? new Date() : null },
    update: { watchedPct: watchedPct ?? 0, lastSecond: lastSecond ?? 0, ...(completed ? { completed: true, completedAt: new Date() } : {}) },
  })

  if (completed) {
    await prisma.moduleCompletion.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: params.id } },
      create: { userId: user.id, moduleId: params.id },
      update: {},
    })
  }

  return NextResponse.json({ progress })
}
