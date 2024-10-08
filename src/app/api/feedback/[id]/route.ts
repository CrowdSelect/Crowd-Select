import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { queryLocalLlm } from '@/lib/localLlm';
import { rateLimitMiddleware } from "@/lib/rateLimit";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await rateLimitMiddleware(request);
    await dbConnect();
    
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { feedback } = await request.json();
    const content = await Content.findById(params.id);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Assess feedback relevance
    const assessmentPrompt = `Assess the relevance of this feedback:
Product: ${content.description}
Feedback: ${feedback.join('\n')}
Is this feedback relevant and valuable? Respond with Yes or No and a brief explanation.`;
    const assessment = await queryLocalLlm(assessmentPrompt);

    // Only add feedback if it's deemed relevant
    if (assessment.toLowerCase().startsWith('yes')) {
      content.feedback = content.feedback || [];
      content.feedback.push({
        userId: session.user.id,
        username: session.user.name, // Changed from username to name to match NextAuth session structure
        responses: feedback,
      });

      // If we have enough feedback, generate a summary
      if (content.feedback.length >= 5 && !content.feedbackSummary) {
        const allFeedback = content.feedback.flatMap(f => f.responses).join('\n');
        const summaryPrompt = `Summarize the following feedback for this product:
${content.description}

Feedback:
${allFeedback}

Provide a concise summary highlighting key points, common themes, and suggestions for improvement.`;
        content.feedbackSummary = await queryLocalLlm(summaryPrompt);
      }

      await content.save();
      return NextResponse.json({ message: 'Feedback submitted successfully' });
    } else {
      return NextResponse.json({ message: 'Feedback deemed irrelevant', assessment }, { status: 400 });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}