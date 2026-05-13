import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Post('seed')
  async seedData() {
    try {
      // Find demo user
      let demoClient = await this.prisma.user.findUnique({
        where: { email: 'demo@btsli.com' },
      });

      if (!demoClient) {
        const hashedPassword = await bcrypt.hash('Demo123!', 10);
        demoClient = await this.prisma.user.create({
          data: {
            email: 'demo@btsli.com',
            name: 'Demo Client',
            passwordHash: hashedPassword,
            role: 'CLIENT',
          },
        });
      }

      // Create courses
      const courses = [
        {
          id: 'course-trauma-leadership-101',
          title: 'Trauma-Informed Leadership Fundamentals',
          description:
            'Learn the core principles of trauma-informed leadership to create safer, more effective workplace environments.',
        },
        {
          id: 'course-communication-skills',
          title: 'Effective Communication Skills',
          description: 'Master essential communication techniques for professional and personal growth.',
        },
        {
          id: 'course-emotional-intelligence',
          title: 'Emotional Intelligence for Leaders',
          description: 'Develop your emotional intelligence to lead with empathy and effectiveness.',
        },
      ];

      for (const courseData of courses) {
        await this.prisma.course.upsert({
          where: { id: courseData.id },
          update: { published: true },
          create: { ...courseData, published: true, ownerCoachId: 'system' },
        });
      }

      // Create modules
      const modules = [
        { id: 'mod-til-intro', courseId: 'course-trauma-leadership-101', title: 'Introduction to Trauma-Informed Leadership', orderIdx: 1 },
        { id: 'mod-til-practice', courseId: 'course-trauma-leadership-101', title: 'Putting It Into Practice', orderIdx: 2 },
        { id: 'mod-comm-basics', courseId: 'course-communication-skills', title: 'Communication Basics', orderIdx: 1 },
        { id: 'mod-ei-intro', courseId: 'course-emotional-intelligence', title: 'Introduction to Emotional Intelligence', orderIdx: 1 },
      ];

      for (const moduleData of modules) {
        await this.prisma.module.upsert({
          where: { id: moduleData.id },
          update: { title: moduleData.title, orderIdx: moduleData.orderIdx },
          create: moduleData,
        });
      }

      // Create lessons
      const lessons = [
        {
          id: 'lesson-til-welcome',
          moduleId: 'mod-til-intro',
          title: 'Welcome to Trauma-Informed Leadership',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 1,
        },
        {
          id: 'lesson-til-foundations',
          moduleId: 'mod-til-intro',
          title: 'Understanding Trauma in the Workplace',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 2,
        },
        {
          id: 'lesson-til-principles',
          moduleId: 'mod-til-intro',
          title: 'Core Principles of Trauma-Informed Care',
          type: 'READING',
          readingHtml:
            '<h2>Six Core Principles</h2><ol><li><strong>Safety</strong></li><li><strong>Trustworthiness & Transparency</strong></li><li><strong>Peer Support</strong></li><li><strong>Collaboration & Mutuality</strong></li><li><strong>Empowerment & Choice</strong></li><li><strong>Cultural Sensitivity</strong></li></ol>',
          orderIdx: 3,
        },
        {
          id: 'lesson-til-communication',
          moduleId: 'mod-til-practice',
          title: 'Trauma-Informed Communication Strategies',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 1,
        },
        {
          id: 'lesson-til-boundaries',
          moduleId: 'mod-til-practice',
          title: 'Setting Healthy Boundaries',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 2,
        },
        {
          id: 'lesson-comm-active-listening',
          moduleId: 'mod-comm-basics',
          title: 'Active Listening Skills',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 1,
        },
        {
          id: 'lesson-comm-nonverbal',
          moduleId: 'mod-comm-basics',
          title: 'Non-Verbal Communication',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 2,
        },
        {
          id: 'lesson-ei-self-awareness',
          moduleId: 'mod-ei-intro',
          title: 'Developing Self-Awareness',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 1,
        },
        {
          id: 'lesson-ei-empathy',
          moduleId: 'mod-ei-intro',
          title: 'Building Empathy',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          orderIdx: 2,
        },
      ];

      for (const lessonData of lessons) {
        const { id, moduleId, ...rest } = lessonData;
        await this.prisma.lesson.upsert({
          where: { id },
          update: rest as any,
          create: lessonData as any,
        });
      }

      // Enroll demo user in courses
      for (const course of courses) {
        await this.prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: demoClient.id,
              courseId: course.id,
            },
          },
          update: {},
          create: {
            userId: demoClient.id,
            courseId: course.id,
          },
        });
      }

      return {
        success: true,
        message: 'Database seeded successfully',
        stats: {
          courses: 3,
          modules: 4,
          lessons: 9,
          enrollments: 3,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
