import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('In-Memory Rate Limiter', () => {
  it('allows requests within limit', () => {
    const testIp = '192.168.1.100';
    const res1 = checkRateLimit(testIp, 3, 10000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(testIp, 3, 10000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(testIp, 3, 10000);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests exceeding limit', () => {
    const testIp = '192.168.1.200';
    // Consume limit of 2
    checkRateLimit(testIp, 2, 10000);
    checkRateLimit(testIp, 2, 10000);

    // 3rd attempt should be blocked
    const blockedRes = checkRateLimit(testIp, 2, 10000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});
