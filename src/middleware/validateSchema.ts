import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateSchema = <T>(schema: z.ZodType<T>) => (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(
        e => `${e.path.join(".")}: ${e.message}`
      ).join(", ");
      
      res.status(400).json({
        success: false,
        error: errorMessage || "Validation error"
      });
    } else {
      next(error);
    }
  }
};
