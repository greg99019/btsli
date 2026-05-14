import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN']

async function getUser(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search') ?? ''

  const where: Record<string, unknown> = {}
  // Non-admins only see published modules
  if (!ADMIN_ROLES.includes(user.role)) where.isPublished = true
  if (category) where.category = category
  if (search) where.title = { contains: search, mode: 'insensitive' }

  const modules = await prisma.trainingModule.findMany({
    where,
    orderBy: [{ orderIdx: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { questions: true, completions: true } },
      questions: { select: { id: true } },
    },
  })

  return NextResponse.json({ modules })
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, description, longDescription, category, videoUrl, videoType, thumbnailUrl, estimatedMinutes, isRequired, passingScore, minWatchPct, isPublished, orderIdx, questions } = body

  if (!title || !description || !category) return NextResponse.json({ message: 'title, description, category required' }, { status: 400 })

  const mod = await prisma.trainingModule.create({
    data: {
      title, description, longDescription, category, videoUrl, videoType, thumbnailUrl,
      estimatedMinutes: estimatedMinutes ?? 30,
      isRequired: isRequired ?? false,
      passingScore: passingScore ?? 0.75,
      minWatchPct: minWatchPct ?? 0.8,
      isPublished: isPublished ?? false,
      orderIdx: orderIdx ?? 0,
      questions: questions?.length ? {
        create: questions.map((q: { prompt: string; orderIdx?: number; choices?: { text: string; isCorrect: boolean }[] }, i: number) => ({
          prompt: q.prompt,
          orderIdx: q.orderIdx ?? i,
          choices: q.choices?.length ? { create: q.choices } : undefined,
        })),
      } : undefined,
    },
    include: { questions: { include: { choices: true } } },
  })

  return NextResponse.json({ module: mod }, { status: 201 })
}
