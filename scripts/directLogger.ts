console.log("Testing logger setup");

import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

logger.info("This is a test message");
logger.debug("This is a debug message");
logger.error("This is an error message");
