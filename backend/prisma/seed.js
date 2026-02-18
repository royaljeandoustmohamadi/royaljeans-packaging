const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@royaljeans.ir' },
    update: {},
    create: {
      email: 'admin@royaljeans.ir',
      password: hashedPassword,
      fullName: 'مدیر سیستم',
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('   Password: admin123');
  
  // Create sample contractors
  const contractors = [
    { name: 'پارچه بازار', type: 'FABRIC', phone: '021-12345678' },
    { name: 'تولیدی البرز', type: 'PRODUCTION', phone: '021-23456789' },
    { name: 'بسته‌بندی نوین', type: 'PACKAGING', phone: '021-34567890' },
    { name: 'سنگشویی زاگرس', type: 'STONE_WASH', phone: '021-45678901' }
  ];

  for (const contractor of contractors) {
    await prisma.contractor.upsert({
      where: { name: contractor.name },
      update: {},
      create: contractor
    });
  }

  console.log('✅ Sample contractors created');
  console.log('🌟 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });