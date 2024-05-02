import { debug as logger } from 'debug';

enum LogType {
  ERROR = 'red',
  DATA = 'lightblue',
  INFO = 'green',
  WARN = 'yellow',
}

interface Debug {
  emmit(loggerIdentifier: string, data: unknown, type: LogType): void;
  error(loggerIdentifier: string, data: unknown): void;
  data(loggerIdentifier: string, data: unknown): void;
  info(loggerIdentifier: string, data: unknown): void;
  warn(loggerIdentifier: string, data: unknown): void;
}

const debug: Debug = {
  emmit(loggerIdentifier, data) {
    const log = logger(loggerIdentifier);
    log.enabled = true;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      log(data);
    }
  },

  error(loggerIdentifier, data) {
    this.emmit(loggerIdentifier, data, LogType.ERROR);
  },

  data(loggerIdentifier, data) {
    this.emmit(loggerIdentifier, data, LogType.DATA);
  },

  info(loggerIdentifier, data) {
    this.emmit(loggerIdentifier, data, LogType.INFO);
  },

  warn(loggerIdentifier, data) {
    this.emmit(loggerIdentifier, data, LogType.WARN);
  },
};

export default debug;
