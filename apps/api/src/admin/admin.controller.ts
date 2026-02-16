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
          create: { ...courseData, published: true },
        });
      }

      // Create modules
      const modules = [
        { id: 'mod-til-intro', courseId: 'course-trauma-leadership-101', title: 'Introduction to Trauma-Informed Leadership', sortOrder: 1 },
        { id: 'mod-til-practice', courseId: 'course-trauma-leadership-101', title: 'Putting It Into Practice', sortOrder: 2 },
        { id: 'mod-comm-basics', courseId: 'course-communication-skills', title: 'Communication Basics', sortOrder: 1 },
        { id: 'mod-ei-intro', courseId: 'course-emotional-intelligence', title: 'Introduction to Emotional Intelligence', sortOrder: 1 },
      ];

      for (const moduleData of modules) {
        await this.prisma.module.upsert({
          where: { id: moduleData.id },
          update: moduleData,
          create: moduleData,
        });
      }

      // Create lessons
      const lessons = [
        {
          id: 'lesson-til-welcome',
          moduleId: 'mod-til-intro',
          title: 'Welcome to Trauma-Informed Leadership',
          description: 'An introduction to the course and what you will learn',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 1,
        },
        {
          id: 'lesson-til-foundations',
          moduleId: 'mod-til-intro',
          title: 'Understanding Trauma in the Workplace',
          description: 'Learn how trauma affects behavior and performance in professional settings',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 2,
        },
        {
          id: 'lesson-til-principles',
          moduleId: 'mod-til-intro',
          title: 'Core Principles of Trauma-Informed Care',
          description: 'Explore the six key principles',
          type: 'READING',
          readingHtml:
            '<h2>Six Core Principles</h2><ol><li><strong>Safety</strong></li><li><strong>Trustworthiness & Transparency</strong></li><li><strong>Peer Support</strong></li><li><strong>Collaboration & Mutuality</strong></li><li><strong>Empowerment & Choice</strong></li><li><strong>Cultural Sensitivity</strong></li></ol>',
          sortOrder: 3,
        },
        {
          id: 'lesson-til-communication',
          moduleId: 'mod-til-practice',
          title: 'Trauma-Informed Communication Strategies',
          description: 'Learn how to communicate in ways that promote safety and build trust',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 1,
        },
        {
          id: 'lesson-til-boundaries',
          moduleId: 'mod-til-practice',
          title: 'Setting Healthy Boundaries',
          description: 'Understand how to establish and maintain appropriate boundaries as a leader',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 2,
        },
        {
          id: 'lesson-comm-active-listening',
          moduleId: 'mod-comm-basics',
          title: 'Active Listening Skills',
          description: 'Master the art of truly hearing what others are saying',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 1,
        },
        {
          id: 'lesson-comm-nonverbal',
          moduleId: 'mod-comm-basics',
          title: 'Non-Verbal Communication',
          description: 'Understanding body language, tone, and other non-verbal cues',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 2,
        },
        {
          id: 'lesson-ei-self-awareness',
          moduleId: 'mod-ei-intro',
          title: 'Developing Self-Awareness',
          description: 'Learn to recognize and understand your own emotions',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 1,
        },
        {
          id: 'lesson-ei-empathy',
          moduleId: 'mod-ei-intro',
          title: 'Building Empathy',
          description: 'Strengthen your ability to understand and relate to others',
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sortOrder: 2,
        },
      ];

      for (const lessonData of lessons) {
        await this.prisma.lesson.upsert({
          where: { id: lessonData.id },
          update: lessonData,
          create: lessonData,
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
