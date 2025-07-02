import { PrismaClient } from '@prisma/client'
import { ApplicationStatus, AdmissionStatus, DocumentType, DocumentStatus, ServiceContractStatus } from './types'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.scholarshipApplication.deleteMany()
  await prisma.document.deleteMany()
  await prisma.serviceContract.deleteMany()
  await prisma.scholarshipDocumentRequirement.deleteMany()
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
  const scholarships = [
    // CSC Government Scholarships
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
      applicationDeadline: new Date('2024-04-30'),
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
      applicationDeadline: new Date('2024-03-31'),
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
      applicationDeadline: new Date('2024-05-15'),
      isActive: true
    },

    // University Scholarships
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
      applicationDeadline: new Date('2024-06-30'),
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
      applicationDeadline: new Date('2024-04-15'),
      isActive: true
    },
    {
      title: 'Zhejiang University Silk Road Scholarship',
      description: 'Special scholarship for Belt and Road Initiative countries including Mongolia. Covers tuition and living expenses.',
      programType: 'bachelor',
      major: 'Environmental Engineering',
      city: 'Hangzhou',
      university: 'Zhejiang University',
      languageProgram: false,
      hskRequired: 4,
      ieltsRequired: 6.0,
      minAge: 18,
      maxAge: 23,
      scholarshipAmount: 70000,
      applicationDeadline: new Date('2024-05-31'),
      isActive: true
    },

    // Language Programs
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
      applicationDeadline: new Date('2024-07-15'),
      isActive: true
    },
    {
      title: 'Confucius Institute Scholarship for Chinese Language',
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
      applicationDeadline: new Date('2024-06-15'),
      isActive: true
    },

    // Provincial Scholarships
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
      maxAge: 32,
      scholarshipAmount: 60000,
      applicationDeadline: new Date('2024-04-20'),
      isActive: true
    },
    {
      title: 'Jiangsu Provincial Scholarship Program',
      description: 'Scholarship for international students in Jiangsu Province with focus on engineering and technology.',
      programType: 'phd',
      major: 'Electrical Engineering',
      city: 'Nanjing',
      university: 'Southeast University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.5,
      minAge: 25,
      maxAge: 40,
      scholarshipAmount: 100000,
      applicationDeadline: new Date('2024-03-25'),
      isActive: true
    },

    // Medical & Health Sciences
    {
      title: 'Medical Scholarship at Capital Medical University',
      description: 'Specialized scholarship for international students pursuing medical degrees in China.',
      programType: 'bachelor',
      major: 'Clinical Medicine',
      city: 'Beijing',
      university: 'Capital Medical University',
      languageProgram: false,
      hskRequired: 6,
      ieltsRequired: 7.0,
      minAge: 18,
      maxAge: 25,
      scholarshipAmount: 180000,
      applicationDeadline: new Date('2024-05-30'),
      isActive: true
    },
    {
      title: 'Traditional Chinese Medicine Scholarship',
      description: 'Scholarship for studying Traditional Chinese Medicine with hands-on clinical experience.',
      programType: 'master',
      major: 'Traditional Chinese Medicine',
      city: 'Chengdu',
      university: 'Chengdu University of Traditional Chinese Medicine',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.0,
      minAge: 22,
      maxAge: 35,
      scholarshipAmount: 85000,
      applicationDeadline: new Date('2024-04-10'),
      isActive: true
    },

    // Arts & Humanities
    {
      title: 'Arts and Design Scholarship at CAFA',
      description: 'Scholarship for international students in fine arts, design, and creative fields.',
      programType: 'bachelor',
      major: 'Fine Arts',
      city: 'Beijing',
      university: 'Central Academy of Fine Arts',
      languageProgram: false,
      hskRequired: 4,
      ieltsRequired: 6.0,
      minAge: 18,
      maxAge: 28,
      scholarshipAmount: 50000,
      applicationDeadline: new Date('2024-06-01'),
      isActive: true
    },
    {
      title: 'Music Performance Scholarship',
      description: 'Scholarship for talented musicians to study at China\'s premier music conservatory.',
      programType: 'master',
      major: 'Music Performance',
      city: 'Beijing',
      university: 'Central Conservatory of Music',
      languageProgram: false,
      hskRequired: 4,
      ieltsRequired: 6.0,
      minAge: 20,
      maxAge: 30,
      scholarshipAmount: 45000,
      applicationDeadline: new Date('2024-03-15'),
      isActive: true
    },

    // Agriculture & Environment
    {
      title: 'Agricultural Sciences Scholarship',
      description: 'Scholarship for sustainable agriculture and food security research programs.',
      programType: 'phd',
      major: 'Agricultural Sciences',
      city: 'Beijing',
      university: 'China Agricultural University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.5,
      minAge: 25,
      maxAge: 40,
      scholarshipAmount: 110000,
      applicationDeadline: new Date('2024-04-30'),
      isActive: true
    },
    {
      title: 'Environmental Science Research Scholarship',
      description: 'Research-focused scholarship for environmental science and climate change studies.',
      programType: 'master',
      major: 'Environmental Science',
      city: 'Changsha',
      university: 'Central South University',
      languageProgram: false,
      hskRequired: 5,
      ieltsRequired: 6.5,
      minAge: 22,
      maxAge: 32,
      scholarshipAmount: 75000,
      applicationDeadline: new Date('2024-05-20'),
      isActive: true
    }
  ]

  const createdScholarships = []
  for (const scholarshipData of scholarships) {
    const scholarship = await prisma.scholarship.create({ data: scholarshipData })
    createdScholarships.push(scholarship)
  }

  console.log('🎓 Created scholarships')

  // Create document requirements for scholarships
  const documentRequirements = [
    { scholarshipId: 1, documentType: DocumentType.PASSPORT, notes: 'Valid passport with at least 6 months remaining' },
    { scholarshipId: 1, documentType: DocumentType.HIGH_SCHOOL_CERTIFICATE, notes: 'Notarized high school diploma or equivalent' },
    { scholarshipId: 1, documentType: DocumentType.HSK_CERTIFICATE, notes: 'HSK Level 6 certificate required' },
    { scholarshipId: 1, documentType: DocumentType.IELTS_CERTIFICATE, notes: 'IELTS 6.5 or equivalent English proficiency' },
    
    { scholarshipId: 2, documentType: DocumentType.PASSPORT, notes: 'Valid passport' },
    { scholarshipId: 2, documentType: DocumentType.HIGH_SCHOOL_CERTIFICATE, notes: 'Bachelor\'s degree certificate for Master\'s program' },
    { scholarshipId: 2, documentType: DocumentType.HSK_CERTIFICATE, notes: 'HSK Level 5 minimum' },
    
    { scholarshipId: 3, documentType: DocumentType.PASSPORT, notes: 'Valid passport' },
    { scholarshipId: 3, documentType: DocumentType.HIGH_SCHOOL_CERTIFICATE, notes: 'Master\'s degree certificate for PhD program' },
    { scholarshipId: 3, documentType: DocumentType.HSK_CERTIFICATE, notes: 'HSK Level 5 minimum' },
    
    { scholarshipId: 4, documentType: DocumentType.PASSPORT, notes: 'Valid passport' },
    { scholarshipId: 4, documentType: DocumentType.HIGH_SCHOOL_CERTIFICATE, notes: 'High school diploma' },
    { scholarshipId: 4, documentType: DocumentType.HSK_CERTIFICATE, notes: 'HSK Level 5 required' },
  ]

  for (const docReq of documentRequirements) {
    await prisma.scholarshipDocumentRequirement.create({ data: docReq })
  }

  console.log('📄 Created document requirements')

  // Create sample applications
  const applications = [
    {
      userId: 'user_sample_1',
      scholarshipId: 1,
      applicationId: 'APP-2024-001-BATCH001',
      status: ApplicationStatus.SUBMITTED,
      collegeAdmissionStatus: AdmissionStatus.PENDING,
      hskLevel: 6,
      ieltsScore: 7.0,
      previousEducation: 'Bachelor of Computer Science from National University of Mongolia',
      motivationLetter: 'I am passionate about artificial intelligence and machine learning. Studying at Tsinghua University would provide me with world-class education and research opportunities to contribute to technological advancement in Mongolia.',
      admissionOfficerNotes: 'Strong academic background, excellent language skills',
      contractSigned: false
    },
    {
      userId: 'user_sample_2',
      scholarshipId: 4,
      applicationId: 'APP-2024-002-BATCH001', 
      status: ApplicationStatus.UNDER_REVIEW,
      collegeAdmissionStatus: AdmissionStatus.PENDING,
      hskLevel: 5,
      ieltsScore: 6.5,
      previousEducation: 'Completed high school at Orchlon International School',
      motivationLetter: 'International business has always fascinated me. I believe studying at Peking University will help me build bridges between Mongolian and Chinese business communities.',
      admissionOfficerNotes: null,
      contractSigned: false
    },
    {
      userId: 'user_sample_3',
      scholarshipId: 2,
      applicationId: 'APP-2024-003-BATCH001',
      status: ApplicationStatus.APPROVED,
      collegeAdmissionStatus: AdmissionStatus.APPROVED,
      hskLevel: 5,
      ieltsScore: 6.0,
      previousEducation: 'Bachelor of Mechanical Engineering from Mongolian University of Science and Technology',
      motivationLetter: 'My goal is to specialize in renewable energy systems. Shanghai Jiao Tong University\'s engineering program is renowned for innovation in sustainable technology.',
      admissionOfficerNotes: 'Excellent candidate with clear career goals',
      contractSigned: true,
      contractDate: new Date('2024-01-15')
    }
  ]

  for (const appData of applications) {
    await prisma.scholarshipApplication.create({ data: appData })
  }

  console.log('📋 Created sample applications')

  // Create sample documents
  const documents = [
    {
      userId: 'user_sample_1',
      applicationId: 1,
      documentType: DocumentType.PASSPORT,
      fileName: 'passport_batbayar.pdf',
      fileUrl: 'https://example.com/documents/passport_batbayar.pdf',
      fileSize: 2048576,
      status: DocumentStatus.APPROVED,
      uploadedBy: 'user_sample_1',
      reviewNotes: 'Passport is valid and clearly readable'
    },
    {
      userId: 'user_sample_1',
      applicationId: 1,
      documentType: DocumentType.HSK_CERTIFICATE,
      fileName: 'hsk6_certificate_batbayar.pdf',
      fileUrl: 'https://example.com/documents/hsk6_batbayar.pdf',
      fileSize: 1024768,
      status: DocumentStatus.APPROVED,
      uploadedBy: 'user_sample_1',
      reviewNotes: 'HSK Level 6 certificate verified'
    },
    {
      userId: 'user_sample_2',
      applicationId: 2,
      documentType: DocumentType.PASSPORT,
      fileName: 'passport_oyunaa.pdf',
      fileUrl: 'https://example.com/documents/passport_oyunaa.pdf',
      fileSize: 1987654,
      status: DocumentStatus.PENDING,
      uploadedBy: 'user_sample_2',
      reviewNotes: null
    },
    {
      userId: 'user_sample_3',
      applicationId: 3,
      documentType: DocumentType.SIGNED_CONTRACT,
      fileName: 'service_contract_erdene.pdf',
      fileUrl: 'https://example.com/documents/contract_erdene.pdf',
      fileSize: 3145728,
      status: DocumentStatus.APPROVED,
      uploadedBy: 'user_sample_3',
      reviewNotes: 'Service contract signed and filed'
    }
  ]

  for (const docData of documents) {
    await prisma.document.create({ data: docData })
  }

  console.log('📁 Created sample documents')

  // Create service contracts
  const contracts = [
    {
      userId: 'user_sample_1',
      status: ServiceContractStatus.SENT,
      contractVersion: '1.0',
      signedAt: null,
      contractDocumentUrl: 'https://example.com/contracts/contract_batbayar.pdf'
    },
    {
      userId: 'user_sample_3', 
      status: ServiceContractStatus.SIGNED,
      contractVersion: '1.0',
      signedAt: new Date('2024-01-15'),
      contractDocumentUrl: 'https://example.com/contracts/contract_erdene_signed.pdf'
    }
  ]

  for (const contractData of contracts) {
    await prisma.serviceContract.create({ data: contractData })
  }

  console.log('📝 Created service contracts')

  console.log('✅ Database seeded successfully!')
  console.log(`Created:
  - ${users.length} users
  - ${scholarships.length} scholarships  
  - ${documentRequirements.length} document requirements
  - ${applications.length} applications
  - ${documents.length} documents
  - ${contracts.length} service contracts`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 