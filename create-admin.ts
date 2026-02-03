import { db } from './src/lib/db';
import { hashPassword } from './src/lib/auth';

async function createAdmin() {
  try {
    const adminData = {
      username: 'admin',
      password: await hashPassword('admin123'), // Change this in production!
      email: 'admin@loanapp.com',
      fullName: 'System Administrator',
    };

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { username: adminData.username },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin
    const admin = await db.admin.create({
      data: adminData,
    });

    console.log('Admin user created successfully:');
    console.log('Username:', admin.username);
    console.log('Password: admin123 (change this in production!)');
    console.log('Email:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
