import { Request, Response } from "express";
import { generateResponse } from "../../controllers/genai.controller";
import * as genaiService from "../../services/genai.service";
import { GenAIError } from "../../services/genai.service";

jest.mock("../../services/genai.service");
jest.mock("../../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

describe("GenAI Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: { prompt: "test prompt" }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.spyOn(genaiService, "generateAIResponse").mockResolvedValue("test response");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if prompt is missing", async () => {
    mockRequest.body = {};
    await generateResponse(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      success: false, 
      error: "Prompt is required" 
    });
  });

  it("should return generated response successfully", async () => {
    await generateResponse(mockRequest as Request, mockResponse as Response);
    expect(genaiService.generateAIResponse).toHaveBeenCalledWith("test prompt");
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      success: true,
      response: "test response" 
    });
  });

  it("should return appropriate status code for GenAIError", async () => {
    // Create error with GenAIError properties
    const rateLimitError = new Error("Rate limit exceeded") as any;
    rateLimitError.name = 'GenAIError';
    rateLimitError.status = 429;
    
    jest.spyOn(genaiService, "generateAIResponse").mockRejectedValue(rateLimitError);
    
    await generateResponse(mockRequest as Request, mockResponse as Response);
    
    expect(mockResponse.status).toHaveBeenCalledWith(429);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: "Rate limit exceeded",
      code: 429
    });
  });

  it("should return 500 for non-GenAIError errors", async () => {
    jest.spyOn(genaiService, "generateAIResponse").mockRejectedValue(new Error("Generic error"));
    
    await generateResponse(mockRequest as Request, mockResponse as Response);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      success: false, 
      error: "Failed to generate response",
      message: "Generic error"
    });
  });
});
