import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function importContentModel() {
  const modelPath = join(__dirname, 'src', 'models', 'Content.ts');
  try {
    // Compile TypeScript file
    await execAsync(`npx tsc ${modelPath} --esModuleInterop --target es2017 --module commonjs --outDir ./tmp`);
    const { Content } = await import('./tmp/Content.js');
    return Content;
  } catch (error) {
    console.error(`Error importing Content model: ${error.message}`);
    process.exit(1);
  }
}

async function migrateData() {
  try {
    await dbConnect();
    const Content = await importContentModel();
    const contents = await Content.find({}).lean();
    for (let content of contents) {
      const updates = {};
      if (!content.fileUrls) updates.fileUrls = [];
      if (!content.votes) updates.votes = [];
      if (!content.upvotes) updates.upvotes = 0;
      if (!content.downvotes) updates.downvotes = 0;
      if (!content.username) updates.username = 'Unknown User';
      if (!content.userId) updates.userId = 'unknown_user_id';

      if (Object.keys(updates).length > 0) {
        await Content.findByIdAndUpdate(content._id, updates, { new: true, runValidators: false });
      }
    }
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}