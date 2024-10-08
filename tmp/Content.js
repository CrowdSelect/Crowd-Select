"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContentSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    fileUrls: [{ type: String, required: true }],
    initialQuestions: { type: String, required: true },
    generatedQuestions: [{ type: String, required: true }],
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
ContentSchema.virtual('totalVotes').get(function () {
    return this.upvotes - this.downvotes;
});
ContentSchema.pre('save', function (next) {
    if (this.isModified('votes')) {
        this.upvotes = this.votes.filter(v => v.value === 'up').length;
        this.downvotes = this.votes.filter(v => v.value === 'down').length;
    }
    next();
});
const ContentModel = mongoose_1.default.models.Content || mongoose_1.default.model('Content', ContentSchema);
exports.Content = ContentModel;
exports.default = ContentModel;
