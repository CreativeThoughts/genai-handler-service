import request from "supertest";
import express from "express";
import { router as genaiRouter } from "../../routes/genai.routes";
import * as genaiService from "../../services/genai.service";

jest.mock("../../services/genai.service");
jest.mock("../../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

describe("GenAI API Endpoints", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/genai", genaiRouter);

  beforeEach(() => {
    jest.spyOn(genaiService, "generateAIResponse").mockResolvedValue("test response");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if prompt is missing", async () => {
    const response = await request(app).post("/api/genai/generate").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ 
      success: false,
      error: "prompt: Required" 
    });
  });

  it("should return generated response successfully", async () => {
    const response = await request(app).post("/api/genai/generate").send({ 
      prompt: "test prompt" 
    });
    
    expect(response.status).toBe(200);
    expect(genaiService.generateAIResponse).toHaveBeenCalledWith("test prompt");
    expect(response.body).toEqual({ 
      success: true,
      response: "test response" 
    });
  });
});
