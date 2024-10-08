import mongoose from 'mongoose';
import { hash } from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function addTestUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    const hashedPassword = await hash('testpassword', 10);
    
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
    });

    await testUser.save();
    console.log('Test user added successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

addTestUser();