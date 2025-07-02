import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (only what we're going to create)
  await prisma.scholarship.deleteMany()
  await prisma.user.deleteMany()  

  console.log('🗑️ Cleared existing data')

  // Create sample users
  const users = [
    {
      userId: 'user_sample_1',
      email: 'batbayar@example.com',
      fullName: 'Batbayar Munkhjargal',
      phone: '+976-9999-1111',
      age: 22,
      nationality: 'Mongolian'
    },
    {
      userId: 'user_sample_2', 
      email: 'oyunaa@example.com',
      fullName: 'Oyunaa Ganbaatar',
      phone: '+976-9999-2222',
      age: 20,
      nationality: 'Mongolian'
    },
    {
      userId: 'user_sample_3',
      email: 'erdene@example.com', 
      fullName: 'Erdene Batjargal',
      phone: '+976-9999-3333',
      age: 24,
      nationality: 'Mongolian'
    }
  ]

  for (const userData of users) {
    await prisma.user.create({ data: userData })
  }

  console.log('👥 Created sample users')

  // Create scholarships
  const scholarshipData = [
      {
      title: 'test scholarship',
      description: 'test description',
      programType: 'bachelor',
      major: 'Computer Science',
      city: 'Beijing',
      university: 'Tsinghua University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.0,
      minAge: 18,
      maxAge: 35,
      scholarshipAmount: 150000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Chinese Government Scholarship - Full Coverage',
      description: 'Full scholarship provided by Chinese Government covering tuition, accommodation, living allowance, and comprehensive medical insurance for international students.',
      programType: 'master',
      major: 'Computer Science',
      city: 'Beijing',
      university: 'Tsinghua University',
      languageProgram: false,
      hskRequired: 6,
      ieltsRequired: 6.5,
      minAge: 18,
      maxAge: 35,
      scholarshipAmount: 150000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'CSC Master\'s Degree Scholarship in Engineering',
      description: 'Chinese Government Scholarship for Master\'s degree in Engineering fields. Covers full tuition and provides monthly living allowance.',
      programType: 'master',
      major: 'Mechanical Engineering',
      city: 'Shanghai',
      university: 'Shanghai Jiao Tong University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.0,
      minAge: 22,
      maxAge: 35,
      scholarshipAmount: 120000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Chinese Government Scholarship for PhD Studies',
      description: 'Full CSC scholarship for PhD studies in Science and Technology fields with research opportunities.',
      programType: 'phd',
      major: 'Materials Science',
      city: 'Beijing',
      university: 'University of Science and Technology Beijing',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.5,
      minAge: 25,
      maxAge: 40,
      scholarshipAmount: 200000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Peking University Excellence Scholarship',
      description: 'Merit-based scholarship for outstanding international students pursuing undergraduate or graduate studies at Peking University.',
      programType: 'bachelor',
      major: 'International Business',
      city: 'Beijing',
      university: 'Peking University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.0,
      minAge: 18,
      maxAge: 25,
      scholarshipAmount: 80000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Fudan University International Student Scholarship',
      description: 'Partial scholarship for international students covering tuition fees and accommodation at Fudan University.',
      programType: 'master',
      major: 'Economics',
      city: 'Shanghai', 
      university: 'Fudan University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.5,
      minAge: 22,
      maxAge: 30,
      scholarshipAmount: 90000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Beijing Language University Chinese Study Program',
      description: 'Intensive Chinese language program with cultural immersion. Perfect for beginners and intermediate learners.',
      programType: 'bachelor',
      major: 'Chinese Language and Literature',
      city: 'Beijing',
      university: 'Beijing Language and Culture University',
      languageProgram: true,
      hskRequired: null,
      ieltsRequired: null,
      minAge: 18,
      maxAge: 30,
      scholarshipAmount: 25000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Guangdong Provincial Government Scholarship',
      description: 'Provincial scholarship for international students studying in Guangdong Province universities.',
      programType: 'master',
      major: 'International Trade',
      city: 'Guangzhou',
      university: 'Sun Yat-sen University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.0,
      minAge: 22,
      maxAge: 30,
      scholarshipAmount: 65000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Silk Road Scholarship for Engineering Students',
      description: 'Special scholarship targeting Belt and Road Initiative countries for engineering and technology studies.',
      programType: 'bachelor',
      major: 'Civil Engineering',
      city: 'Xi\'an',
      university: 'Xi\'an Jiaotong University',
      languageProgram: false,
      hskRequired: 4,
      ieltsRequired: 6.0,
      minAge: 18,
      maxAge: 25,
      scholarshipAmount: 55000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Zhejiang University International Scholarship',
      description: 'Merit-based scholarship for international students at one of China\'s top comprehensive universities.',
      programType: 'master',
      major: 'Environmental Engineering',
      city: 'Hangzhou',
      university: 'Zhejiang University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.5,
      minAge: 22,
      maxAge: 30,
      scholarshipAmount: 95000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    },
    {
      title: 'Confucius Institute Scholarship',
      description: 'Scholarship program funded by Confucius Institute for Chinese language study and cultural exchange.',
      programType: 'bachelor',
      major: 'Teaching Chinese to Speakers of Other Languages',
      city: 'Tianjin',
      university: 'Tianjin Normal University',
      languageProgram: true,
      hskRequired: null,
      ieltsRequired: null,
      minAge: 18,
      maxAge: 35,
      scholarshipAmount: 30000,
      applicationDeadline: new Date('2025-08-30'),
      isActive: true
    }
  ]

  const createdScholarships = []
  for (const scholarship of scholarshipData) {
    const created = await prisma.scholarship.create({ data: scholarship })
    createdScholarships.push(created)
  }

  console.log(`🎓 Created ${createdScholarships.length} scholarships`)
  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 