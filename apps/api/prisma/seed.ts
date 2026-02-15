import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
