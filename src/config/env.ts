import dotenv from "dotenv";
import path from "path";

dotenv.config();

interface Config {
  server: {
    port: number;
    nodeEnv: string;
    apiVersion: string;
    logLevel: string;
  };
  cors: {
    origin: string;
    methods: string;
    allowedHeaders: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  genai: {
    provider: string;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
  monitoring: {
    enableMetrics: boolean;
    metricsPath: string;
  };
}

export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    apiVersion: process.env.API_VERSION || "v1",
    logLevel: process.env.LOG_LEVEL || "info",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE",
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || "Content-Type,Authorization",
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
  genai: {
    provider: process.env.GENAI_PROVIDER || "openai",
    apiKey: process.env.GENAI_API_KEY || "",
    model: process.env.GENAI_MODEL || "gpt-4",
    maxTokens: parseInt(process.env.GENAI_MAX_TOKENS || "1000", 10),
    temperature: parseFloat(process.env.GENAI_TEMPERATURE || "0.7"),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || "300", 10),
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || "100", 10),
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === "true",
    metricsPath: process.env.METRICS_PATH || "/metrics",
  },
};

export default config;
