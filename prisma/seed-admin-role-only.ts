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

  console.log('Database admin role only successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 