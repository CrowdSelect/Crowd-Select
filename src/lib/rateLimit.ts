import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

export async function rateLimitMiddleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const tokenCount = rateLimit.get(ip) || 0;

  if (tokenCount >= 5) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  rateLimit.set(ip, tokenCount + 1);
}