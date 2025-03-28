import config from "../config/env";
import { withRetry, defaultRetryConfig } from "../utils/retryUtils";
import logger from "../utils/logger";

// Custom error class for GenAI API errors
export class GenAIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = "GenAIError";
    this.status = status;
  }
}

export const generateAIResponse = async (prompt: string): Promise<string> => {
  logger.info(`Using ${config.genai.provider} model: ${config.genai.model}`);
  logger.info(`Max tokens: ${config.genai.maxTokens}, Temperature: ${config.genai.temperature}`);
  
  return withRetry(
    async () => {
      try {
        // In a real application, this would be an actual API call to the genAI provider
        // This is a placeholder implementation that simulates potential rate limit errors
        
        // Simulate a random rate limit error (for demonstration purposes)
        if (Math.random() < 0.3) {
          logger.warn("Simulated rate limit error");
          throw new GenAIError("Rate limit exceeded", 429);
        }
        
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return a generated response
        return `Generated response for: ${prompt} [using ${config.genai.model}]`;
      } catch (error: any) {
        // If it's already a GenAIError, just rethrow it
        if (error instanceof GenAIError) {
          throw error;
        }
        
        // Otherwise, wrap it with status code if possible
        const status = error.status || error.statusCode || 500;
        throw new GenAIError(`GenAI API error: ${error.message}`, status);
      }
    },
    // Use the default retry config from our utility
    defaultRetryConfig,
    // Custom retry condition (mainly for rate limits, but also for temporary server errors)
    (error) => {
      const retryableStatusCodes = defaultRetryConfig.retryableStatusCodes;
      const shouldRetry = error instanceof GenAIError && retryableStatusCodes.includes(error.status);
      
      if (shouldRetry) {
        logger.warn(`Retryable error encountered (${error.status}): ${error.message}`);
      }
      
      return shouldRetry;
    }
  );
};
