declare module '@dazn/lambda-powertools-logger' {
  class Logger {
    static debug(message: string): void;
    static debug(message: string, attributes: object): void;
    static info(message: string): void;
    static info(message: string, attributes: object): void;
    static warn(message: string): void;
    static warn(message: string, error: Error): void;
    static warn(message: string, attributes: object): void;
    static warn(message: string, error: Error, attributes: object): void;
    static error(message: string): void;
    static error(message: string, error: Error): void;
    static error(message: string, attributes: object): void;
    static error(message: string, error: Error, attributes: object): void;
    debug(message: string): void;
    debug(message: string, attributes: object): void;
    info(message: string): void;
    info(message: string, attributes: object): void;
    warn(message: string): void;
    warn(message: string, error: Error): void;
    warn(message: string, attributes: object): void;
    warn(message: string, error: Error, attributes: object): void;
    error(message: string): void;
    error(message: string, error: Error): void;
    error(message: string, attributes: object): void;
    error(message: string, error: Error, attributes: object): void;
  }

  export = Logger;
}
