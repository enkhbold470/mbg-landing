import { PrismaClient, AdminRole } from '@prisma/client'
import { siteConfig } from '../config/site'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create initial super admin
  const superAdminPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'superadmin@mbg.edu',
      password: superAdminPassword,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  })

  // Create a regular admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@mbg.edu',
      password: adminPassword,
      role: AdminRole.ADMIN,
      isActive: true,
    },
  })

  console.log('✅ Created admin users:')
  console.log('  - Super Admin: superadmin / admin123')
  console.log('  - Admin: admin / admin123')

  // Create site configuration
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: siteConfig.name,
      description: siteConfig.description,
      tagline: siteConfig.tagline,
      slogan: siteConfig.slogan,
      url: siteConfig.url,
      ogImage: siteConfig.ogImage,
    },
  })

  console.log('✅ Created site configuration')

  // Note: Courses are now managed through the admin panel
  // You can add courses manually or use the AI auto-fill feature

  // Import testimonials, partners, features, and FAQ from site config
  const { testimonials, partners, features, faq } = await import('../config/site')

  // Create testimonials
  for (let i = 0; i < testimonials.length; i++) {
    const testimonial = testimonials[i]
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${i}` },
      update: {},
      create: {
        id: `testimonial-${i}`,
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
        image: testimonial.image,
      },
    })
  }

  // Create partners
  for (let i = 0; i < partners.length; i++) {
    const partner = partners[i]
    await prisma.partner.upsert({
      where: { id: `partner-${i}` },
      update: {},
      create: {
        id: `partner-${i}`,
        name: partner.name,
        logo: partner.logo,
        url: partner.url,
      },
    })
  }

  // Create features
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    await prisma.feature.upsert({
      where: { id: `feature-${i}` },
      update: {},
      create: {
        id: `feature-${i}`,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        order: i,
      },
    })
  }

  // Create FAQ items
  for (let i = 0; i < faq.length; i++) {
    const faqItem = faq[i]
    await prisma.fAQ.upsert({
      where: { id: `faq-${i}` },
      update: {},
      create: {
        id: `faq-${i}`,
        question: faqItem.question,
        answer: faqItem.answer,
        order: i,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 