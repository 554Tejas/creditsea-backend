import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from '../models/User';

dotenv.config();

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';
    await mongoose.connect(uri);
    console.log('Connected to Database for Seeding...');

    // Clear existing users to prevent duplicates during seed
    await User.deleteMany({});
    console.log('Cleared existing users.');

    const defaultPassword = 'password123';

    const usersToCreate = [
      {
        name: 'System Admin',
        email: 'admin@lms.com',
        password: defaultPassword,
        role: UserRole.ADMIN,
      },
      {
        name: 'Sales Executive',
        email: 'sales@lms.com',
        password: defaultPassword,
        role: UserRole.SALES,
      },
      {
        name: 'Sanction Executive',
        email: 'sanction@lms.com',
        password: defaultPassword,
        role: UserRole.SANCTION,
      },
      {
        name: 'Disbursement Executive',
        email: 'disbursement@lms.com',
        password: defaultPassword,
        role: UserRole.DISBURSEMENT,
      },
      {
        name: 'Collection Executive',
        email: 'collection@lms.com',
        password: defaultPassword,
        role: UserRole.COLLECTION,
      },
      {
        name: 'Test Borrower',
        email: 'borrower@lms.com',
        password: defaultPassword,
        role: UserRole.BORROWER,
      },
    ];

    await User.create(usersToCreate);
    console.log('Seed successful! Added 1 account per role with password "password123".');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();