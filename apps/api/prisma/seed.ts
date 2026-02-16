import { PrismaClient, ServiceCategory, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo users
  const demoPassword = await bcrypt.hash('Demo123!', 10);
  
  const demoClient = await prisma.user.upsert({
    where: { email: 'demo@btsli.com' },
    update: {},
    create: {
      email: 'demo@btsli.com',
      name: 'Demo Client',
      passwordHash: demoPassword,
      role: Role.CLIENT,
    },
  });

  const demoCoach = await prisma.user.upsert({
    where: { email: 'coach@btsli.com' },
    update: {},
    create: {
      email: 'coach@btsli.com',
      name: 'Demo Coach',
      passwordHash: demoPassword,
      role: Role.COACH,
    },
  });

  console.log(`✅ Created demo accounts:`);
  console.log(`   Client: demo@btsli.com / Demo123!`);
  console.log(`   Coach: coach@btsli.com / Demo123!`);
  console.log('');

  const services = [
    {
      name: 'Individual Coaching Session (Non Clinical)',
      slug: 'individual-coaching-session',
      category: ServiceCategory.INDIVIDUAL,
      description:
        'Non-clinical, trauma-aware, coaching-based support for individuals seeking to strengthen communication, emotional regulation, leadership skills, and workforce readiness.',
      priceMin: 99,
      priceMax: 150,
      durationMin: 60,
      unitLabel: 'per person',
      focusAreas: ['Communication', 'Emotional regulation', 'Leadership skills', 'Workforce readiness'],
    },
    {
      name: 'Parent & Caregiver Coaching Session (Non Clinical)',
      slug: 'parent-caregiver-coaching-session',
      category: ServiceCategory.FAMILY,
      description:
        'Trauma-aware, coaching-based support for parents and caregivers focused on communication, connection, problem-solving, and resilience.',
      priceMin: 99,
      priceMax: 150,
      durationMin: 60,
      unitLabel: 'per person',
      focusAreas: ['Communication & connection', 'Problem-solving', 'Family resilience'],
    },
    {
      name: 'Workplace Communication Coaching',
      slug: 'workplace-communication-coaching',
      category: ServiceCategory.ORGANIZATIONAL,
      description:
        'Coaching to strengthen professional communication, reduce misunderstandings/conflict, and build clarity, confidence, and emotional regulation.',
      priceMin: 650,
      priceMax: 1000,
      durationMin: 60,
      unitLabel: 'per person',
      focusAreas: ['Professional communication', 'Conflict reduction', 'Clarity & confidence', 'Communication with supervisors/peers/clients'],
    },
    {
      name: 'Professionalism & Workplace Behavior Coaching',
      slug: 'professionalism-workplace-behavior-coaching',
      category: ServiceCategory.ORGANIZATIONAL,
      description:
        'Coaching for accountability, time management/executive functioning, workplace etiquette/boundaries, and navigating feedback.',
      priceMin: 600,
      priceMax: 950,
      durationMin: 60,
      unitLabel: 'per person',
      focusAreas: ['Accountability & follow-through', 'Time management', 'Workplace etiquette & boundaries', 'Feedback & expectations'],
    },
    {
      name: 'Leadership & Supervisor Coaching',
      slug: 'leadership-supervisor-coaching',
      category: ServiceCategory.ORGANIZATIONAL,
      description:
        'Trauma-aware leadership coaching to strengthen communication, delegation, decision-making, confidence, and reduce reactive leadership patterns.',
      priceMin: 850,
      priceMax: 1500,
      durationMin: 60,
      unitLabel: 'per leader',
      focusAreas: ['Trauma-aware leadership', 'Delegation & team support', 'Decision-making & confidence', 'Reducing reactive patterns'],
    },
    {
      name: 'Team Dynamics & Collaboration Coaching',
      slug: 'team-dynamics-collaboration-coaching',
      category: ServiceCategory.ORGANIZATIONAL,
      description:
        'Team sessions to improve cohesion, address communication breakdowns, strengthen trust, and support morale/culture.',
      priceMin: 1500,
      priceMax: 3000,
      durationMin: 90,
      unitLabel: 'per team session',
      focusAreas: ['Team cohesion', 'Communication repair', 'Trust & shared problem-solving', 'Morale & culture'],
    },
    {
      name: 'Workforce Readiness & Soft Skills Coaching',
      slug: 'workforce-readiness-soft-skills-coaching',
      category: ServiceCategory.ORGANIZATIONAL,
      description:
        'Coaching to prepare employees for advancement by strengthening adaptability, reliability, workplace presence, emotional intelligence, and self-management.',
      priceMin: 650,
      priceMax: 1200,
      durationMin: 60,
      unitLabel: 'per person',
      focusAreas: ['Advancement readiness', 'Adaptability & reliability', 'Workplace presence', 'Emotional intelligence'],
    },
    {
      name: 'Organizational Behavior Support',
      slug: 'organizational-behavior-support',
      category: ServiceCategory.ORGANIZATIONAL,
      description:
        'Support to identify communication patterns affecting performance, coach teams through change/stress/conflict, and build healthier workplace norms.',
      priceMin: 2000,
      priceMax: 4500,
      durationMin: 90,
      unitLabel: 'per session',
      focusAreas: ['Communication pattern analysis', 'Change/stress/conflict coaching', 'Healthier workplace norms'],
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, active: true },
      create: { ...s, active: true },
    });
  }

  console.log(`Seeded ${services.length} services.`);
  console.log('');

  // Create sample courses
  const traumaLeadershipCourse = await prisma.course.upsert({
    where: { id: 'course-trauma-leadership-101' },
    update: {},
    create: {
      id: 'course-trauma-leadership-101',
      title: 'Trauma-Informed Leadership Fundamentals',
      description: 'Learn the core principles of trauma-informed leadership to create safer, more effective workplace environments.',
      published: true,
    },
  });

  const communicationCourse = await prisma.course.upsert({
    where: { id: 'course-communication-skills' },
    update: {},
    create: {
      id: 'course-communication-skills',
      title: 'Effective Communication Skills',
      description: 'Master essential communication techniques for professional and personal growth.',
      published: true,
    },
  });

  const emotionalIntCourse = await prisma.course.upsert({
    where: { id: 'course-emotional-intelligence' },
    update: {},
    create: {
      id: 'course-emotional-intelligence',
      title: 'Emotional Intelligence for Leaders',
      description: 'Develop your emotional intelligence to lead with empathy and effectiveness.',
      published: true,
    },
  });

  console.log(`✅ Created ${3} courses`);
  console.log('');

  // Create modules and lessons for Trauma-Informed Leadership course
  const module1 = await prisma.module.upsert({
    where: { id: 'mod-til-intro' },
    update: {},
    create: {
      id: 'mod-til-intro',
      courseId: traumaLeadershipCourse.id,
      title: 'Introduction to Trauma-Informed Leadership',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-til-welcome' },
    update: {},
    create: {
      id: 'lesson-til-welcome',
      moduleId: module1.id,
      title: 'Welcome to Trauma-Informed Leadership',
      description: 'An introduction to the course and what you will learn',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-til-foundations' },
    update: {},
    create: {
      id: 'lesson-til-foundations',
      moduleId: module1.id,
      title: 'Understanding Trauma in the Workplace',
      description: 'Learn how trauma affects behavior and performance in professional settings',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 2,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-til-principles' },
    update: {},
    create: {
      id: 'lesson-til-principles',
      moduleId: module1.id,
      title: 'Core Principles of Trauma-Informed Care',
      description: 'Explore the six key principles: safety, trustworthiness, peer support, collaboration, empowerment, and cultural sensitivity',
      type: 'READING',
      readingHtml: '<h2>Six Core Principles</h2><ol><li><strong>Safety</strong> - Creating physical and emotional safety</li><li><strong>Trustworthiness & Transparency</strong> - Building trust through consistency</li><li><strong>Peer Support</strong> - Fostering connection and mutual support</li><li><strong>Collaboration & Mutuality</strong> - Sharing power and decision-making</li><li><strong>Empowerment & Choice</strong> - Recognizing strengths and autonomy</li><li><strong>Cultural Sensitivity</strong> - Honoring diversity and context</li></ol>',
      sortOrder: 3,
    },
  });

  const module2 = await prisma.module.upsert({
    where: { id: 'mod-til-practice' },
    update: {},
    create: {
      id: 'mod-til-practice',
      courseId: traumaLeadershipCourse.id,
      title: 'Putting It Into Practice',
      sortOrder: 2,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-til-communication' },
    update: {},
    create: {
      id: 'lesson-til-communication',
      moduleId: module2.id,
      title: 'Trauma-Informed Communication Strategies',
      description: 'Learn how to communicate in ways that promote safety and build trust',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-til-boundaries' },
    update: {},
    create: {
      id: 'lesson-til-boundaries',
      moduleId: module2.id,
      title: 'Setting Healthy Boundaries',
      description: 'Understand how to establish and maintain appropriate boundaries as a leader',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 2,
    },
  });

  // Create modules and lessons for Communication Skills course
  const commModule1 = await prisma.module.upsert({
    where: { id: 'mod-comm-basics' },
    update: {},
    create: {
      id: 'mod-comm-basics',
      courseId: communicationCourse.id,
      title: 'Communication Basics',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-comm-active-listening' },
    update: {},
    create: {
      id: 'lesson-comm-active-listening',
      moduleId: commModule1.id,
      title: 'Active Listening Skills',
      description: 'Master the art of truly hearing what others are saying',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-comm-nonverbal' },
    update: {},
    create: {
      id: 'lesson-comm-nonverbal',
      moduleId: commModule1.id,
      title: 'Non-Verbal Communication',
      description: 'Understanding body language, tone, and other non-verbal cues',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 2,
    },
  });

  // Create modules and lessons for Emotional Intelligence course
  const eiModule1 = await prisma.module.upsert({
    where: { id: 'mod-ei-intro' },
    update: {},
    create: {
      id: 'mod-ei-intro',
      courseId: emotionalIntCourse.id,
      title: 'Introduction to Emotional Intelligence',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-ei-self-awareness' },
    update: {},
    create: {
      id: 'lesson-ei-self-awareness',
      moduleId: eiModule1.id,
      title: 'Developing Self-Awareness',
      description: 'Learn to recognize and understand your own emotions',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'lesson-ei-empathy' },
    update: {},
    create: {
      id: 'lesson-ei-empathy',
      moduleId: eiModule1.id,
      title: 'Building Empathy',
      description: 'Strengthen your ability to understand and relate to others',
      type: 'VIDEO',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 2,
    },
  });

  console.log(`✅ Created modules and lessons (10 video lessons, 1 reading lesson)`);
  console.log('');

  // Enroll demo user in all courses
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: demoClient.id,
        courseId: traumaLeadershipCourse.id,
      },
    },
    update: {},
    create: {
      userId: demoClient.id,
      courseId: traumaLeadershipCourse.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: demoClient.id,
        courseId: communicationCourse.id,
      },
    },
    update: {},
    create: {
      userId: demoClient.id,
      courseId: communicationCourse.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: demoClient.id,
        courseId: emotionalIntCourse.id,
      },
    },
    update: {},
    create: {
      userId: demoClient.id,
      courseId: emotionalIntCourse.id,
    },
  });

  console.log(`✅ Enrolled demo user in ${3} courses`);
  console.log('');
  console.log('🎉 Seed complete! Demo user can now access courses and video lessons.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
