import { queryLocalLlm } from '@/lib/localLlm';

export async function POST(request: Request) {
  const { productDescription, feedback } = await request.json();
  const assessment = await queryLocalLlm(`Assess the relevance of this feedback:
Product: ${productDescription}
Feedback: ${feedback}
Is this feedback relevant and valuable? Respond with Yes or No and a brief explanation.`);
  return NextResponse.json({ assessment });
}