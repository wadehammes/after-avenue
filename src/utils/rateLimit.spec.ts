import { checkRateLimit, getRemainingRequests } from "src/utils/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Clear the rate limit store before each test
    // Since the store is not exported, we'll test by using different identifiers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("checkRateLimit", () => {
    it("should allow requests within limit", () => {
      const identifier = "test-1";
      expect(checkRateLimit(identifier, 5, 1000)).toBe(false);
      expect(checkRateLimit(identifier, 5, 1000)).toBe(false);
      expect(checkRateLimit(identifier, 5, 1000)).toBe(false);
      expect(checkRateLimit(identifier, 5, 1000)).toBe(false);
      expect(checkRateLimit(identifier, 5, 1000)).toBe(false);
    });

    it("should block requests exceeding limit", () => {
      const identifier = "test-2";
      // Make 5 requests (within limit)
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(identifier, 5, 1000)).toBe(false);
      }
      // 6th request should be blocked
      expect(checkRateLimit(identifier, 5, 1000)).toBe(true);
    });

    it("should reset after time window expires", () => {
      const identifier = "test-3";
      const windowMs = 1000;

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(identifier, 5, windowMs)).toBe(false);
      }

      // Should be blocked
      expect(checkRateLimit(identifier, 5, windowMs)).toBe(true);

      // Advance time past the window
      jest.advanceTimersByTime(windowMs + 1);

      // Should be allowed again
      expect(checkRateLimit(identifier, 5, windowMs)).toBe(false);
    });

    it("should handle different identifiers independently", () => {
      const identifier1 = "test-4";
      const identifier2 = "test-5";

      // Exhaust limit for identifier1
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(identifier1, 5, 1000)).toBe(false);
      }
      expect(checkRateLimit(identifier1, 5, 1000)).toBe(true);

      // identifier2 should still have full limit
      expect(checkRateLimit(identifier2, 5, 1000)).toBe(false);
    });

    it("should use default values when not specified", () => {
      const identifier = "test-6";
      // Should work with defaults (5 requests, 15 minutes)
      expect(checkRateLimit(identifier)).toBe(false);
    });

    it("should allow custom max requests", () => {
      const identifier = "test-7";
      // Make 3 requests with limit of 3
      expect(checkRateLimit(identifier, 3, 1000)).toBe(false);
      expect(checkRateLimit(identifier, 3, 1000)).toBe(false);
      expect(checkRateLimit(identifier, 3, 1000)).toBe(false);
      // 4th should be blocked
      expect(checkRateLimit(identifier, 3, 1000)).toBe(true);
    });

    it("should handle very short time windows", () => {
      const identifier = "test-8";
      const windowMs = 100;

      expect(checkRateLimit(identifier, 2, windowMs)).toBe(false);
      expect(checkRateLimit(identifier, 2, windowMs)).toBe(false);
      expect(checkRateLimit(identifier, 2, windowMs)).toBe(true);

      // Advance time
      jest.advanceTimersByTime(windowMs + 1);

      // Should reset
      expect(checkRateLimit(identifier, 2, windowMs)).toBe(false);
    });
  });

  describe("getRemainingRequests", () => {
    it("should return max requests for new identifier", () => {
      const identifier = "test-9";
      expect(getRemainingRequests(identifier, 5)).toBe(5);
    });

    it("should return correct remaining requests", () => {
      const identifier = "test-10";
      const maxRequests = 5;

      // Make 2 requests
      checkRateLimit(identifier, maxRequests, 1000);
      checkRateLimit(identifier, maxRequests, 1000);

      expect(getRemainingRequests(identifier, maxRequests)).toBe(3);
    });

    it("should return 0 when limit is exhausted", () => {
      const identifier = "test-11";
      const maxRequests = 3;

      // Exhaust limit
      for (let i = 0; i < maxRequests; i++) {
        checkRateLimit(identifier, maxRequests, 1000);
      }

      expect(getRemainingRequests(identifier, maxRequests)).toBe(0);
    });

    it("should reset after time window expires", () => {
      const identifier = "test-12";
      const maxRequests = 5;
      const windowMs = 1000;

      // Make some requests
      checkRateLimit(identifier, maxRequests, windowMs);
      checkRateLimit(identifier, maxRequests, windowMs);

      expect(getRemainingRequests(identifier, maxRequests)).toBe(3);

      // Advance time past window
      jest.advanceTimersByTime(windowMs + 1);

      // Should reset to max
      expect(getRemainingRequests(identifier, maxRequests)).toBe(maxRequests);
    });

    it("should handle custom max requests", () => {
      const identifier = "test-13";
      const maxRequests = 10;

      checkRateLimit(identifier, maxRequests, 1000);
      checkRateLimit(identifier, maxRequests, 1000);

      expect(getRemainingRequests(identifier, maxRequests)).toBe(8);
    });

    it("should not return negative values", () => {
      const identifier = "test-14";
      const maxRequests = 2;

      // Exhaust limit
      checkRateLimit(identifier, maxRequests, 1000);
      checkRateLimit(identifier, maxRequests, 1000);
      checkRateLimit(identifier, maxRequests, 1000); // Exceeds limit

      // Should not be negative
      expect(getRemainingRequests(identifier, maxRequests)).toBe(0);
    });
  });
});
