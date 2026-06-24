import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimiter(windowMs: number = 60000, maxRequests: number = 100) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
    const now = Date.now();
    let entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }
    entry.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));
    if (entry.count > maxRequests) {
      res.status(429).json({ success: false, error: 'Too many requests, please try again later', timestamp: Date.now() });
      return;
    }
    next();
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60000);
