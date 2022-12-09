const isTestEnvironment = process.env["NODE_ENV"] === "test";

interface LoggerInterface {
  debug: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}

const mockImplementation = {
  debug: (..._args: any[]) => undefined,
  error: (..._args: any[]) => undefined,
  info: (..._args: any[]) => undefined,
  log: (..._args: any[]) => undefined,
  warn: (..._args: any[]) => undefined,
};

export default function createLogger(
  categoryName: string,
  impl: LoggerInterface = isTestEnvironment ? mockImplementation : console
) {
  return {
    debug: (...args: any[]) => {
      return impl.debug(`[${categoryName}]`, ...args);
    },
    error: (...args: any[]) => {
      return impl.error(`[${categoryName}]`, ...args);
    },
    info: (...args: any[]) => {
      return impl.info(`[${categoryName}]`, ...args);
    },
    log: (...args: any[]) => {
      return impl.log(`[${categoryName}]`, ...args);
    },
    warn: (...args: any[]) => {
      return impl.warn(`[${categoryName}]`, ...args);
    },
  };
}
