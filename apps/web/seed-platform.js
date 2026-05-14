// seed-platform.js — run with: node seed-platform.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding platform...')

  // Organizations
  const orgs = await Promise.all([
    prisma.organization.upsert({
      where: { slug: 'riverside-community-schools' }, update: {},
      create: { name: 'Riverside Community Schools', slug: 'riverside-community-schools', industry: 'Education', sizeRange: '201-500', isActive: true },
    }),
    prisma.organization.upsert({
      where: { slug: 'metro-health-alliance' }, update: {},
      create: { name: 'Metro Health Alliance', slug: 'metro-health-alliance', industry: 'Healthcare', sizeRange: '51-200', isActive: true },
    }),
    prisma.organization.upsert({
      where: { slug: 'techforward-corp' }, update: {},
      create: { name: 'TechForward Corp', slug: 'techforward-corp', industry: 'Technology', sizeRange: '11-50', isActive: true },
    }),
  ])
  console.log(`Created/updated ${orgs.length} organizations`)

  const hash = (p) => bcrypt.hashSync(p, 10)
  const userData = [
    { email: 'aknight_n@hotmail.com', name: 'Anthony Knight', role: 'SUPER_ADMIN', password: 'Jacky123', orgId: null },
    { email: 'consultant@btsli.com', name: 'Marcus Taylor', role: 'CONSULTANT', password: 'Demo1234', orgId: null },
    { email: 'jsmith@riverside.edu', name: 'Jessica Smith', role: 'ORG_ADMIN', password: 'Demo1234', orgId: orgs[0].id, jobTitle: 'HR Director', department: 'Human Resources' },
    { email: 'david.r@riverside.edu', name: 'David Rodriguez', role: 'MANAGER', password: 'Demo1234', orgId: orgs[0].id, jobTitle: 'Principal', department: 'Administration' },
    { email: 'emily.t@riverside.edu', name: 'Emily Thompson', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[0].id, jobTitle: 'Teacher', department: 'Education' },
    { email: 'carlos.m@riverside.edu', name: 'Carlos Mendoza', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[0].id, jobTitle: 'Counselor', department: 'Student Services' },
    { email: 'sarah.w@riverside.edu', name: 'Sarah Williams', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[0].id, jobTitle: 'Aide', department: 'Education' },
    { email: 'nurse.admin@metrohealth.org', name: 'Patricia Chen', role: 'ORG_ADMIN', password: 'Demo1234', orgId: orgs[1].id, jobTitle: 'Training Coordinator', department: 'HR' },
    { email: 'dr.james@metrohealth.org', name: 'James Okafor', role: 'MANAGER', password: 'Demo1234', orgId: orgs[1].id, jobTitle: 'Department Head', department: 'Internal Medicine' },
    { email: 'rn.lisa@metrohealth.org', name: 'Lisa Patel', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[1].id, jobTitle: 'RN', department: 'Emergency' },
    { email: 'tech.mike@metrohealth.org', name: 'Michael Foster', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[1].id, jobTitle: 'Lab Tech', department: 'Pathology' },
    { email: 'hr@techforward.io', name: 'Amanda Lee', role: 'ORG_ADMIN', password: 'Demo1234', orgId: orgs[2].id, jobTitle: 'People Ops Manager', department: 'HR' },
    { email: 'dev.alex@techforward.io', name: 'Alex Kim', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[2].id, jobTitle: 'Software Engineer', department: 'Engineering' },
    { email: 'design.ryan@techforward.io', name: 'Ryan Brooks', role: 'PARTICIPANT', password: 'Demo1234', orgId: orgs[2].id, jobTitle: 'UX Designer', department: 'Product' },
  ]

  const createdUsers = []
  for (const u of userData) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      const updated = await prisma.user.update({
        where: { email: u.email },
        data: { name: u.name, role: u.role, orgId: u.orgId, jobTitle: u.jobTitle || null, department: u.department || null },
      })
      createdUsers.push(updated)
    } else {
      const created = await prisma.user.create({
        data: { email: u.email, name: u.name, role: u.role, orgId: u.orgId, jobTitle: u.jobTitle || null, department: u.department || null, passwordHash: hash(u.password), isActive: true },
      })
      createdUsers.push(created)
    }
  }
  console.log(`Upserted ${createdUsers.length} users`)

  const moduleData = [
    {
      title: 'Welcome to Your Workplace', description: 'An orientation to our values, expectations, and daily operations.',
      longDescription: 'This foundational module introduces new team members to our organizational culture, core values, policies, and the tools they will use every day.',
      category: 'GETTING_STARTED', estimatedMinutes: 20, isRequired: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.70, minWatchPct: 0.8, isPublished: true, orderIdx: 1,
      questions: [
        { prompt: 'What is the primary purpose of a workplace orientation?', choices: ['To assign desk space', 'To introduce culture, tools, and expectations', 'To train on advanced skills', 'None of the above'], correct: 1 },
        { prompt: 'Organizational values should guide:', choices: ['Only executive decisions', 'Daily behaviors and decisions at all levels', 'Annual reviews only', 'External marketing'], correct: 1 },
      ],
    },
    {
      title: 'Effective Workplace Communication', description: 'Master verbal, written, and digital communication in professional settings.',
      category: 'COMMUNICATION', estimatedMinutes: 35, isRequired: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.75, minWatchPct: 0.8, isPublished: true, orderIdx: 2,
      questions: [
        { prompt: 'Active listening involves:', choices: ['Waiting for your turn to speak', 'Fully concentrating on the speaker', 'Checking your phone while listening', 'Interrupting with solutions'], correct: 1 },
        { prompt: 'Professional email communication should include:', choices: ['Emojis to seem friendly', 'A clear subject line and concise message', 'All-caps for emphasis', 'No greeting or sign-off'], correct: 1 },
        { prompt: 'When a message could be misunderstood, you should:', choices: ['Send it anyway', 'Add more jargon', 'Clarify or choose a different communication method', 'Ignore it'], correct: 2 },
      ],
    },
    {
      title: 'Understanding Standard Operating Procedures', description: 'Learn how SOPs protect quality, safety, and consistency across your team.',
      category: 'SOPS', estimatedMinutes: 25, isRequired: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.80, minWatchPct: 0.75, isPublished: true, orderIdx: 3,
      questions: [
        { prompt: 'The primary purpose of an SOP is to:', choices: ['Replace manager judgment', 'Ensure tasks are done consistently and safely', 'Punish employees for mistakes', 'Replace training'], correct: 1 },
        { prompt: 'If an SOP seems outdated or incorrect, you should:', choices: ['Ignore it', 'Report it to your supervisor for review', 'Create your own version', 'Skip the step'], correct: 1 },
      ],
    },
    {
      title: 'Accountability in the Workplace', description: 'Build habits of ownership, follow-through, and responsibility.',
      category: 'ACCOUNTABILITY', estimatedMinutes: 30, isRequired: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.75, minWatchPct: 0.8, isPublished: true, orderIdx: 4,
      questions: [
        { prompt: 'Accountability means:', choices: ['Blaming others when things go wrong', 'Taking ownership of your actions and results', 'Doing only what you are told', 'Avoiding difficult conversations'], correct: 1 },
        { prompt: 'When you make a mistake at work, the best response is:', choices: ['Deny it happened', 'Blame a coworker', 'Acknowledge it, correct it, and learn from it', 'Wait and hope no one notices'], correct: 2 },
      ],
    },
    {
      title: 'Customer Service Excellence', description: 'Deliver outstanding service experiences in every interaction.',
      category: 'CUSTOMER_SERVICE', estimatedMinutes: 40, isRequired: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.75, minWatchPct: 0.8, isPublished: true, orderIdx: 5,
      questions: [
        { prompt: 'The most important factor in customer satisfaction is:', choices: ['Speed of service', 'Feeling heard and valued', 'Price', 'Product quality alone'], correct: 1 },
        { prompt: 'When a customer is upset, you should first:', choices: ['Transfer them immediately', 'Defend your organization', 'Acknowledge their feelings and listen', 'Offer a discount right away'], correct: 2 },
        { prompt: 'Service recovery means:', choices: ['Ignoring complaints', 'Turning a negative experience into a positive one', 'Issuing refunds only', 'Escalating all complaints to managers'], correct: 1 },
      ],
    },
    {
      title: 'Workplace Safety & Compliance', description: 'Protect yourself and your colleagues with essential safety knowledge.',
      category: 'COMPLIANCE_SAFETY', estimatedMinutes: 45, isRequired: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.85, minWatchPct: 0.9, isPublished: true, orderIdx: 6,
      questions: [
        { prompt: 'If you observe an unsafe condition, you should:', choices: ['Ignore it if it does not affect you', 'Report it immediately to your supervisor', 'Wait until someone is hurt to be sure', 'Fix it yourself without telling anyone'], correct: 1 },
        { prompt: 'Emergency exits should be:', choices: ['Locked when not in use', 'Clearly marked and never blocked', 'Used only by managers', 'Propped open at all times'], correct: 1 },
        { prompt: 'Compliance regulations exist to:', choices: ['Increase paperwork', 'Protect workers, customers, and the organization', 'Slow down operations', 'Punish employees'], correct: 1 },
      ],
    },
    {
      title: 'Team Collaboration & Dynamics', description: 'Work effectively across teams, roles, and personalities.',
      category: 'TEAM_COLLABORATION', estimatedMinutes: 30, isRequired: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.70, minWatchPct: 0.75, isPublished: true, orderIdx: 7,
      questions: [
        { prompt: 'Psychological safety in a team means:', choices: ['Never having conflict', 'Feeling safe to speak up without fear of punishment', 'Keeping all opinions to yourself', 'Only managers can share concerns'], correct: 1 },
        { prompt: 'When team members disagree, you should:', choices: ['Avoid the conversation', 'Address the issue respectfully and collaboratively', 'Complain to others', 'Let it fester until it resolves itself'], correct: 1 },
      ],
    },
    {
      title: 'Leadership Foundations', description: 'Develop essential leadership skills for supervisors and aspiring leaders.',
      category: 'LEADERSHIP', estimatedMinutes: 50, isRequired: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.75, minWatchPct: 0.8, isPublished: true, orderIdx: 8,
      questions: [
        { prompt: 'Effective leaders primarily focus on:', choices: ['Maximizing their own visibility', 'Developing and empowering their team', 'Maintaining strict hierarchy', 'Delegating all responsibility'], correct: 1 },
        { prompt: 'Constructive feedback should be:', choices: ['Delivered only in writing', 'Vague to avoid conflict', 'Specific, timely, and focused on behavior not character', 'Saved for annual reviews'], correct: 2 },
      ],
    },
    {
      title: 'Digital Workplace Systems', description: 'Navigate the tools and technologies that power your workflow.',
      category: 'WORKPLACE_SYSTEMS', estimatedMinutes: 25, isRequired: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.70, minWatchPct: 0.75, isPublished: true, orderIdx: 9,
      questions: [
        { prompt: 'Data security best practices include:', choices: ['Sharing passwords with trusted colleagues', 'Using strong unique passwords and MFA', 'Using the same password everywhere for ease', 'Disabling screen lock'], correct: 1 },
        { prompt: 'When receiving a suspicious email, you should:', choices: ['Click the links to investigate', 'Forward it to the entire team', 'Report it to IT and do not click any links', 'Delete it and tell no one'], correct: 2 },
      ],
    },
    {
      title: 'Performance Improvement & Goal Setting', description: 'Set SMART goals and build continuous improvement habits.',
      category: 'PERFORMANCE_IMPROVEMENT', estimatedMinutes: 35, isRequired: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoType: 'youtube',
      passingScore: 0.75, minWatchPct: 0.8, isPublished: true, orderIdx: 10,
      questions: [
        { prompt: 'SMART goals are:', choices: ['Simple, Manageable, Achievable, Realistic, Timely', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Simple, Meaningful, Accurate, Reasonable, Timely', 'Strategic, Measurable, Accountable, Relevant, Thoughtful'], correct: 1 },
        { prompt: 'Continuous improvement is best supported by:', choices: ['Blaming others for failures', 'Regular reflection and iterative adjustments', 'Waiting for an annual review', 'Doing only the minimum required'], correct: 1 },
      ],
    },
  ]

  const modules = []
  for (const m of moduleData) {
    const existing = await prisma.trainingModule.findFirst({ where: { title: m.title } })
    if (existing) { modules.push(existing); continue }
    const created = await prisma.trainingModule.create({
      data: {
        title: m.title, description: m.description, longDescription: m.longDescription || null,
        category: m.category, estimatedMinutes: m.estimatedMinutes, isRequired: m.isRequired,
        videoUrl: m.videoUrl, videoType: m.videoType, passingScore: m.passingScore,
        minWatchPct: m.minWatchPct, isPublished: m.isPublished, orderIdx: m.orderIdx,
        questions: {
          create: m.questions.map((q, qi) => ({
            prompt: q.prompt, orderIdx: qi,
            choices: { create: q.choices.map((text, ci) => ({ text, isCorrect: ci === q.correct })) },
          })),
        },
      },
    })
    modules.push(created)
  }
  console.log(`Seeded ${modules.length} training modules`)

  const adminUser = createdUsers.find(u => u.email === 'aknight_n@hotmail.com')
  if (adminUser) {
    try {
      await prisma.announcement.create({
        data: { title: 'Welcome to the New Training Portal!', body: 'We are excited to launch our new workplace training platform. All team members are required to complete onboarding modules within 30 days.', type: 'success', pinned: true, authorId: adminUser.id },
      })
    } catch {}
    try {
      await prisma.announcement.create({
        data: { title: 'Safety Compliance Deadline Approaching', body: 'All staff must complete the Workplace Safety & Compliance module by end of month. This is mandatory for all employees.', type: 'alert', pinned: false, authorId: adminUser.id },
      })
    } catch {}
  }

  console.log('Seeding complete!')
  console.log('\nDemo Accounts:')
  console.log('  Super Admin: aknight_n@hotmail.com / Jacky123')
  console.log('  Consultant:  consultant@btsli.com / Demo1234')
  console.log('  Org Admin:   jsmith@riverside.edu / Demo1234')
  console.log('  Participant: emily.t@riverside.edu / Demo1234')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
