import { Request, Response } from "express";
import { generateAIResponse, GenAIError } from "../services/genai.service";
import { z } from "zod";
import { GeneratePromptSchema } from "../schemas/genai.schema";
import logger from "../utils/logger";

type GeneratePromptRequest = z.infer<typeof GeneratePromptSchema>;

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body as GeneratePromptRequest;
    
    // Check if prompt is missing
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required"
      });
    }
    
    logger.info(`Processing prompt request: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`);
    
    const response = await generateAIResponse(prompt);
    
    return res.json({ 
      success: true,
      response 
    });
  } catch (error: any) {
    logger.error(`Error generating response: ${error.message}`);
    
    // Check for GenAIError by name or instance
    if (error.name === 'GenAIError' || error instanceof GenAIError) {
      const statusCode = error.status || 500;
      
      // Send appropriate status code based on the error
      return res.status(statusCode).json({
        success: false,
        error: error.message,
        code: statusCode
      });
    }
    
    // Generic error handling
    return res.status(500).json({ 
      success: false, 
      error: "Failed to generate response",
      message: error.message
    });
  }
};
