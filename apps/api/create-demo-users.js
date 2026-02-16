const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    console.log('Creating demo user accounts...\n');

    const hash = await bcrypt.hash('Demo123!', 10);

    // Create demo client
    const client = await prisma.user.upsert({
      where: { email: 'demo@btsli.com' },
      update: {},
      create: {
        email: 'demo@btsli.com',
        name: 'Demo Client',
        passwordHash: hash,
        role: 'CLIENT',
      },
    });

    // Create demo coach
    const coach = await prisma.user.upsert({
      where: { email: 'coach@btsli.com' },
      update: {},
      create: {
        email: 'coach@btsli.com',
        name: 'Demo Coach',
        passwordHash: hash,
        role: 'COACH',
      },
    });

    console.log('✅ Demo accounts created successfully!\n');
    console.log('📧 Client Login:');
    console.log('   Email: demo@btsli.com');
    console.log('   Password: Demo123!\n');
    console.log('📧 Coach Login:');
    console.log('   Email: coach@btsli.com');
    console.log('   Password: Demo123!\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createDemoUsers();
