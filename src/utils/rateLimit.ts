/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, email, etc.)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limited, false otherwise
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes default
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true; // Rate limited
  }

  // Increment count
  entry.count += 1;
  return false;
}

/**
 * Get remaining requests for an identifier
 */
export function getRemainingRequests(
  identifier: string,
  maxRequests = 5,
): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry || entry.resetTime < Date.now()) {
    return maxRequests;
  }
  return Math.max(0, maxRequests - entry.count);
}
