import config from "./env";

/**
 * Validates that all required environment variables are set
 * @returns An array of missing environment variables
 */
export const validateEnv = (): string[] => {
  const missing: string[] = [];
  
  // Check for required variables
  if (!config.genai.apiKey) {
    missing.push("GENAI_API_KEY");
  }
  
  if (!config.security.jwtSecret || config.security.jwtSecret === "default_jwt_secret") {
    missing.push("JWT_SECRET");
  }
  
  return missing;
};

/**
 * Verifies environment variables and logs warnings
 */
export const verifyEnv = (): void => {
  const missing = validateEnv();
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(", ")}`);
    console.warn("Please set these variables in your .env file or environment.");
  } else {
    console.log("✅ All required environment variables are set.");
  }
  
  // Check for development mode
  if (config.server.nodeEnv === "development") {
    console.log("🛠️ Running in development mode");
  }
};

export default validateEnv;
