import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './backend/Models/AdminModel.js';

dotenv.config({ path: './backend/.env' });

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI missing in backend/.env');
  process.exit(2);
}

const userId = process.argv[2];

await mongoose.connect(uri);

await Admin.findOneAndUpdate(
  { userId },
  {
    userId,
    role: 'super_admin',
    permissions: {
      manageUsers: true,
      viewReports: true,
      manageSOS: true,
      manageContent: true,
      systemSettings: true,
      accessControl: true,
      manageSupport: true,
      manageReports: true,
      manageSettings: true
    },
    isActive: true,
    approvalDate: new Date()
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

console.log('PROMOTION_OK');
await mongoose.disconnect();
