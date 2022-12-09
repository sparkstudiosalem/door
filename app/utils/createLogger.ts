export default function createLogger(categoryName: string) {
  return {
    debug: (...args: any[]) => {
      return console.debug(`[${categoryName}]`, ...args);
    },
    error: (...args: any[]) => {
      return console.error(`[${categoryName}]`, ...args);
    },
    info: (...args: any[]) => {
      return console.info(`[${categoryName}]`, ...args);
    },
    log: (...args: any[]) => {
      return console.log(`[${categoryName}]`, ...args);
    },
    warn: (...args: any[]) => {
      return console.warn(`[${categoryName}]`, ...args);
    },
  };
}
