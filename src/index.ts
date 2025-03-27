import { createApp } from "./app";
import config from "./config/env";
import { verifyEnv } from "./config/validate";

// Verify environment variables
verifyEnv();

const app = createApp();

app.listen(config.server.port, () => {
  console.log(`🚀 Server running in ${config.server.nodeEnv} mode on port ${config.server.port}`);
  console.log(`📚 API Version: ${config.server.apiVersion}`);
  console.log(`🔍 Health check available at: http://localhost:${config.server.port}/health`);
});
