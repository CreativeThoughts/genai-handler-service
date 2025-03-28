import { calculateBackoffDelay, defaultRetryConfig } from "../../utils/retryUtils";

// We'll mock the sleep and test withRetry manually without relying on complex mocks
jest.mock("../../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

describe("Retry Utilities", () => {
  describe("calculateBackoffDelay", () => {
    it("should calculate exponential backoff with initial attempt", () => {
      const config = { ...defaultRetryConfig };
      const delay = calculateBackoffDelay(0, config);
      
      // With jitter, the delay should be approximately initialDelayMs
      expect(delay).toBeGreaterThanOrEqual(config.initialDelayMs * 0.85);
      expect(delay).toBeLessThanOrEqual(config.initialDelayMs * 1.15);
    });

    it("should increase delay exponentially with each attempt", () => {
      const config = { ...defaultRetryConfig };
      const delay1 = calculateBackoffDelay(1, config);
      const delay2 = calculateBackoffDelay(2, config);
      
      // With backoffFactor of 2, delay2 should be approximately 2x delay1
      // (accounting for jitter)
      expect(delay2).toBeGreaterThan(delay1);
    });

    it("should respect maxDelayMs", () => {
      const config = {
        ...defaultRetryConfig,
        initialDelayMs: 1000,
        maxDelayMs: 2000,
        backoffFactor: 10 // Use a large factor to quickly exceed maxDelayMs
      };
      
      const delay = calculateBackoffDelay(2, config);
      expect(delay).toBeLessThanOrEqual(config.maxDelayMs);
    });
  });
}); 