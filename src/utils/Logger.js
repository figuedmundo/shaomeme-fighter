import pino from "pino";

const isBrowser = typeof window !== "undefined";

// Robust environment detection for both Node and Vite/Browser
const isDev =
  (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") ||
  (isBrowser &&
    (import.meta.env?.DEV || import.meta.env?.MODE === "development"));

// Default log level
const DEFAULT_LEVEL =
  (isBrowser ? import.meta.env?.VITE_LOG_LEVEL : process.env?.LOG_LEVEL) ||
  (isDev ? "trace" : "info");

// Configuration for Browser
const browserConfig = {
  browser: {
    asObject: false, // Set to false for more readable console logs in browser
  },
  level: DEFAULT_LEVEL,
};

// Configuration for Node.js
const nodeConfig = {
  level: DEFAULT_LEVEL,
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
};

const logger = pino(isBrowser ? browserConfig : nodeConfig);

if (isBrowser) {
  console.log("UnifiedLogger: Initializing in browser...");
  logger.debug({
    msg: "UnifiedLogger initialized in browser",
    isDev,
    level: DEFAULT_LEVEL,
    env: import.meta.env?.MODE,
  });
} else if (isDev) {
  logger.debug(
    `UnifiedLogger initialized in Node (Dev mode). Level: ${DEFAULT_LEVEL}`,
  );
}

/**
 * Custom wrapper to support consistent source prefixing
 * and easier multi-level logging.
 */
class UnifiedLogger {
  constructor(source = "App", pinoInstance = null) {
    this.source = source;
    this.pino = pinoInstance || logger.child({ source });
  }

  /**
   * Internal method to check if a level is enabled
   * Phaser/Vite specific: allow overriding level via window.LOG_LEVEL
   */
  get level() {
    if (isBrowser && window.LOG_LEVEL) return window.LOG_LEVEL;
    return this.pino.level;
  }

  set level(val) {
    this.pino.level = val;
  }

  error(msg, ...args) {
    this.pino.error(msg, ...args);
  }

  warn(msg, ...args) {
    this.pino.warn(msg, ...args);
  }

  info(msg, ...args) {
    this.pino.info(msg, ...args);
  }

  debug(msg, ...args) {
    this.pino.debug(msg, ...args);
  }

  /**
   * Verbose is mapped to trace level in pino
   */
  verbose(msg, ...args) {
    this.pino.trace(msg, ...args);
  }

  /**
   * Creates a child logger with a sub-source
   */
  child(subSource) {
    const childPino = this.pino.child({
      source: `${this.source}:${subSource}`,
    });
    return new UnifiedLogger(`${this.source}:${subSource}`, childPino);
  }
}

// Export a default instance for general use
export const log = new UnifiedLogger();

// Export the class for creating component-specific loggers
export default UnifiedLogger;
