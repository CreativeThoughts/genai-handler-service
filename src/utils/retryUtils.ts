/**
 * Utility functions for implementing retry logic with exponential backoff
 */

import logger from "./logger";

// Type for the retry configuration
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
  retryableStatusCodes: number[];
}

// Default retry configuration
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second initial delay
  maxDelayMs: 15000, // 15 seconds max delay
  backoffFactor: 2,
  retryableStatusCodes: [429, 503, 504], // Rate limit and service unavailable errors
};

// Sleep function for implementing delays
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Calculate exponential backoff delay
export const calculateBackoffDelay = (
  attempt: number,
  { initialDelayMs, maxDelayMs, backoffFactor }: RetryConfig
): number => {
  // Calculate delay with jitter (randomness)
  const exponentialDelay = initialDelayMs * Math.pow(backoffFactor, attempt);
  const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
  const delay = Math.min(exponentialDelay * jitter, maxDelayMs);
  return Math.floor(delay);
};

// Generic retry function for async operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig,
  isRetryable: (error: any) => boolean = (error) => {
    // Default retry condition checks for status codes in retryableStatusCodes
    return config.retryableStatusCodes.includes(error?.status || error?.statusCode);
  }
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        logger.info(`Retry attempt ${attempt} of ${config.maxRetries}`);
      }
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry
      if (attempt >= config.maxRetries || !isRetryable(error)) {
        logger.error(`Error not retryable or max retries reached: ${error.message}`);
        throw error;
      }
      
      // Calculate delay for next retry
      const delayMs = calculateBackoffDelay(attempt, config);
      logger.info(`Rate limit or server error encountered. Retrying in ${delayMs}ms...`);
      
      // Wait before next retry
      await sleep(delayMs);
    }
  }
  
  throw lastError;
} 