import mongoose, { Document, Model } from 'mongoose';

interface IContent extends Document {
  title: string;
  description: string;
  userId: string;
  username: string;
  fileUrls: string[];
  initialQuestions: string;
  generatedQuestions: string[];
  createdAt: Date;
  feedback: Array<{
    userId: string;
    username: string;
    responses: string[];
    createdAt: Date;
  }>;
  feedbackSummary?: string;
  votes: Array<{
    userId: string;
    value: 'up' | 'down';
  }>;
  upvotes: number;
  downvotes: number;
}


const ContentSchema = new mongoose.Schema<IContent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, default: 'unknown_user_id' },
  username: { type: String, default: 'Unknown User' },
  fileUrls: [{ type: String }],
  initialQuestions: { type: String, required: true },
  generatedQuestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  feedback: [{
    userId: { type: String, required: true },
    username: { type: String, required: true },
    responses: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now }
  }],
  feedbackSummary: String,
  votes: [{
    userId: { type: String, required: true },
    value: { type: String, enum: ['up', 'down'], required: true }
  }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 }
});


ContentSchema.virtual('totalVotes').get(function(this: IContent) {
  return this.upvotes - this.downvotes;
});

ContentSchema.pre('save', function(this: IContent, next) {
  if (this.isModified('votes')) {
    this.upvotes = this.votes.filter(v => v.value === 'up').length;
    this.downvotes = this.votes.filter(v => v.value === 'down').length;
  }
  next();
});

const ContentModel: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export { ContentModel as Content };
export default ContentModel;