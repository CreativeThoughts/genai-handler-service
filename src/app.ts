import express, { Express, Request, Response } from "express";
import cors from "cors";
import { router as genaiRouter } from "./routes/genai.routes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import config from "./config/env";

export const createApp = (): Express => {
  const app = express();
  
  // CORS configuration based on env variables
  app.use(cors({
    origin: config.cors.origin,
    methods: config.cors.methods.split(","),
    allowedHeaders: config.cors.allowedHeaders.split(",")
  }));
  
  // Middleware
  app.use(express.json());
  app.use(requestLogger);
  
  // API version prefix
  const apiPrefix = `/api/${config.server.apiVersion}`;
  
  // Routes
  app.use(`${apiPrefix}/genai`, genaiRouter);
  
  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      version: config.server.apiVersion,
      environment: config.server.nodeEnv
    });
  });
  
  // Error handler (must be last)
  app.use(errorHandler);
  
  return app;
};
