export default function createLogger(categoryName: string) {
  return {
    debug: (...args: any[]) => {
      return console.debug(`[${categoryName}]`, ...args);
    },
    info: (...args: any[]) => {
      return console.info(`[${categoryName}]`, ...args);
    },
    log: (...args: any[]) => {
      return console.log(`[${categoryName}]`, ...args);
    },
  };
}
