import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'
import { nanoid } from 'nanoid'

// POST /api/training/[id]/quiz  — submit answers, get score, issue cert if passing
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getRequestToken(req)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await verifyAuthToken(token)

  const { answers } = await req.json() as { answers: { questionId: string; choiceId: string }[] }
  if (!answers?.length) return NextResponse.json({ message: 'No answers provided' }, { status: 400 })

  const mod = await prisma.trainingModule.findUnique({
    where: { id: params.id },
    include: { questions: { include: { choices: { select: { id: true, isCorrect: true } } } } },
  })
  if (!mod) return NextResponse.json({ message: 'Module not found' }, { status: 404 })

  // Grade answers
  let correct = 0
  for (const ans of answers) {
    const question = mod.questions.find(q => q.id === ans.questionId)
    const choice = question?.choices.find(c => c.id === ans.choiceId)
    if (choice?.isCorrect) correct++
  }

  const total = mod.questions.length
  const score = total > 0 ? correct / total : 0
  const passed = score >= mod.passingScore

  // Record attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      moduleId: params.id,
      score,
      passed,
      answers: {
        create: answers.map(a => ({ questionId: a.questionId, choiceId: a.choiceId })),
      },
    },
  })

  // Update progress
  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId: params.id } },
    create: { userId: user.id, moduleId: params.id, quizScore: score, quizAttempts: 1, completed: passed, completedAt: passed ? new Date() : null },
    update: { quizScore: score, quizAttempts: { increment: 1 }, ...(passed ? { completed: true, completedAt: new Date() } : {}) },
  })

  let certificate = null
  if (passed) {
    // Complete the module
    await prisma.moduleCompletion.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: params.id } },
      create: { userId: user.id, moduleId: params.id, score },
      update: { score },
    })

    // Issue certificate
    certificate = await prisma.workplaceCertificate.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: params.id } },
      create: { userId: user.id, moduleId: params.id, certId: nanoid(12).toUpperCase(), score },
      update: {},
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'certificate',
        title: 'Certificate Earned!',
        message: `You completed "${mod.title}" with a score of ${Math.round(score * 100)}%`,
        link: `/certificates`,
      },
    })
  }

  return NextResponse.json({ score, passed, correct, total, attemptId: attempt.id, certificate })
}
