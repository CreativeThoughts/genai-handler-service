import { Router } from "express";
import { generateResponse } from "../controllers/genai.controller";
import { validateSchema } from "../middleware/validateSchema";
import { GeneratePromptSchema } from "../schemas/genai.schema";

const router = Router();

// Wrap the controller with a function that ignores the return value
router.post(
  "/generate", 
  validateSchema(GeneratePromptSchema), 
  async (req, res, next) => {
    try {
      await generateResponse(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export { router };
