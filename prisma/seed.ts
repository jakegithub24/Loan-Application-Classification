import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash admin password
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Create default admin if not exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: adminPassword,
        email: 'admin@secureloan.com',
        fullName: 'System Administrator',
      },
    });
    console.log('✅ Admin account created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@secureloan.com');
  } else {
    console.log('ℹ️  Admin account already exists, skipping...');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
