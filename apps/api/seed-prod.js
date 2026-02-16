// Simple script to seed production database
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.DATABASE_URL || 'mongodb+srv://...'; // You'll need to set this

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🔗 Connected to MongoDB');

    // Hash password
    const demoPassword = await bcrypt.hash('Demo123!', 10);
    
    // Find or create demo user
    const usersCollection = db.collection('User');
    let demoClient = await usersCollection.findOne({ email: 'demo@btsli.com' });
    
    if (!demoClient) {
      const result = await usersCollection.insertOne({
        email: 'demo@btsli.com',
        name: 'Demo Client',
        passwordHash: demoPassword,
        role: 'CLIENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      demoClient = { _id: result.insertedId, email: 'demo@btsli.com' };
      console.log('✅ Created demo user');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // Create courses
    const coursesCollection = db.collection('Course');
   const courses = [
      {
        _id: 'course-trauma-leadership-101',
        title: 'Trauma-Informed Leadership Fundamentals',
        description: 'Learn the core principles of trauma-informed leadership to create safer, more effective workplace environments.',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'course-communication-skills',
        title: 'Effective Communication Skills',
        description: 'Master essential communication techniques for professional and personal growth.',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'course-emotional-intelligence',
        title: 'Emotional Intelligence for Leaders',
        description: 'Develop your emotional intelligence to lead with empathy and effectiveness.',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const course of courses) {
      await coursesCollection.updateOne(
        { _id: course._id },
        { $set: course },
        { upsert: true }
      );
    }
    console.log('✅ Created 3 courses');

    // Create modules and lessons
    const modulesCollection = db.collection('Module');
    const lessonsCollection = db.collection('Lesson');

    const modules = [
      {
        _id: 'mod-til-intro',
        courseId: 'course-trauma-leadership-101',
        title: 'Introduction to Trauma-Informed Leadership',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'mod-til-practice',
        courseId: 'course-trauma-leadership-101',
        title: 'Putting It Into Practice',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'mod-comm-basics',
        courseId: 'course-communication-skills',
        title: 'Communication Basics',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'mod-ei-intro',
        courseId: 'course-emotional-intelligence',
        title: 'Introduction to Emotional Intelligence',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const module of modules) {
      await modulesCollection.updateOne(
        { _id: module._id },
        { $set: module },
        { upsert: true }
      );
    }
    console.log('✅ Created 4 modules');

    const lessons = [
      {
        _id: 'lesson-til-welcome',
        moduleId: 'mod-til-intro',
        title: 'Welcome to Trauma-Informed Leadership',
        description: 'An introduction to the course and what you will learn',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-til-foundations',
        moduleId: 'mod-til-intro',
        title: 'Understanding Trauma in the Workplace',
        description: 'Learn how trauma affects behavior and performance in professional settings',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-til-principles',
        moduleId: 'mod-til-intro',
        title: 'Core Principles of Trauma-Informed Care',
        description: 'Explore the six key principles: safety, trustworthiness, peer support, collaboration, empowerment, and cultural sensitivity',
        type: 'READING',
        readingHtml: '<h2>Six Core Principles</h2><ol><li><strong>Safety</strong> - Creating physical and emotional safety</li><li><strong>Trustworthiness & Transparency</strong> - Building trust through consistency</li><li><strong>Peer Support</strong> - Fostering connection and mutual support</li><li><strong>Collaboration & Mutuality</strong> - Sharing power and decision-making</li><li><strong>Empowerment & Choice</strong> - Recognizing strengths and autonomy</li><li><strong>Cultural Sensitivity</strong> - Honoring diversity and context</li></ol>',
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-til-communication',
        moduleId: 'mod-til-practice',
        title: 'Trauma-Informed Communication Strategies',
        description: 'Learn how to communicate in ways that promote safety and build trust',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-til-boundaries',
        moduleId: 'mod-til-practice',
        title: 'Setting Healthy Boundaries',
        description: 'Understand how to establish and maintain appropriate boundaries as a leader',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-comm-active-listening',
        moduleId: 'mod-comm-basics',
        title: 'Active Listening Skills',
        description: 'Master the art of truly hearing what others are saying',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-comm-nonverbal',
        moduleId: 'mod-comm-basics',
        title: 'Non-Verbal Communication',
        description: 'Understanding body language, tone, and other non-verbal cues',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-ei-self-awareness',
        moduleId: 'mod-ei-intro',
        title: 'Developing Self-Awareness',
        description: 'Learn to recognize and understand your own emotions',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'lesson-ei-empathy',
       moduleId: 'mod-ei-intro',
        title: 'Building Empathy',
        description: 'Strengthen your ability to understand and relate to others',
        type: 'VIDEO',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const lesson of lessons) {
      await lessonsCollection.updateOne(
        { _id: lesson._id },
        { $set: lesson },
        { upsert: true }
      );
    }
    console.log('✅ Created 9 video lessons + 1 reading lesson');

    // Enroll demo user in courses
    const enrollmentsCollection = db.collection('Enrollment');
    const enrollments = [
      {
        userId: demoClient._id.toString(),
        courseId: 'course-trauma-leadership-101',
        enrolledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: demoClient._id.toString(),
        courseId: 'course-communication-skills',
        enrolledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: demoClient._id.toString(),
        courseId: 'course-emotional-intelligence',
        enrolledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const enrollment of enrollments) {
      await enrollmentsCollection.updateOne(
        { userId: enrollment.userId, courseId: enrollment.courseId },
        { $set: enrollment },
        { upsert: true }
      );
    }
    console.log('✅ Enrolled demo user in 3 courses');

    console.log('');
    console.log('🎉 Production database seeded successfully!');
    console.log('🔗 Login at: https://btsli.vercel.app/login');
    console.log('👤 Email: demo@btsli.com');
    console.log('🔑 Password: Demo123!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Usage: DATABASE_URL="mongodb+srv://..." node seed-prod.js
if (require.main === module) {
  seed().catch(console.error);
}

module.exports = { seed };
