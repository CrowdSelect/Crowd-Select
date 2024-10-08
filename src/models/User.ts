import { Schema, model, models, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  solanaWallet?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  solanaWallet: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);