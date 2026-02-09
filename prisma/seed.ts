import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Create or update the specific admin user
  const admin = await prisma.user.upsert({
    where: { email: 'ovi@razibmarketing.net' },
    update: {
      name: 'Md Atiar Rahman Ovi',
      role: 'ADMIN',
      department: 'WEB', // Assuming Junior Manager is in WEB department or we could add a title field if needed, but role is enough for now. The prompt says Position: Junior Manager. I'll stick to Role: ADMIN but maybe add Position field later if schema allows. For now, Role is used for access control.
      password: 'scrypt-hash-placeholder',
    },
    create: {
      email: 'ovi@razibmarketing.net',
      name: 'Md Atiar Rahman Ovi',
      role: 'ADMIN',
      department: 'WEB',
      password: 'scrypt-hash-placeholder',
      points: 1350, // Give some initial points
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'lead@nexus.com' },
    update: {},
    create: {
      email: 'lead@nexus.com',
      name: 'Team Lead',
      role: 'EDITOR',
      department: 'SEO',
      password: 'scrypt-hash-placeholder',
    },
  })

  const subscriber = await prisma.user.upsert({
    where: { email: 'member@nexus.com' },
    update: {},
    create: {
      email: 'member@nexus.com',
      name: 'Team Member',
      role: 'SUBSCRIBER',
      department: 'UI_UX',
      password: 'scrypt-hash-placeholder',
    },
  })

  // SOPs
  await prisma.sOP.create({
    data: {
      title: 'How to Deploy to Vercel',
      category: 'WEB_DEV',
      content: '1. Commit code.\n2. Push to main.\n3. Vercel automatically deploys.',
      videoUrl: 'https://loom.com/share/example',
    },
  })

  await prisma.sOP.create({
    data: {
      title: 'SEO Checklist for New Pages',
      category: 'SEO',
      content: '- [ ] Meta Title\n- [ ] Meta Description\n- [ ] H1 Tag',
      videoUrl: 'https://loom.com/share/example2',
    },
  })

  // Valid Requests
  await prisma.request.create({
    data: {
      title: 'Fix typo on Homepage',
      description: 'There is a typo in the hero section.',
      type: 'BUG',
      submittedBy: subscriber.id,
    },
  })

  // Ideas
  await prisma.idea.create({
    data: {
      title: 'Automated Daily Reports',
      description: 'We should automate the daily SEO report generation.',
      submittedBy: editor.id,
    },
  })

  console.log({ admin, editor, subscriber })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
