import { generateAIResponse } from "../../services/genai.service"; describe("GenAI Service", () => { it("should generate a response based on a prompt", async () => { const prompt = "Hello world"; const response = await generateAIResponse(prompt); expect(response).toContain(prompt); }); it("should work with empty prompts", async () => { const prompt = ""; const response = await generateAIResponse(prompt); expect(typeof response).toBe("string"); }); it("should work with special characters", async () => { const prompt = "Hello! How are you? 123 $%^"; const response = await generateAIResponse(prompt); expect(response).toContain(prompt); }); });
