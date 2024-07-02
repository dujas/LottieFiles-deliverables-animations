import winston, { createLogger } from 'winston';
import { loggerConfig } from '@/config/logger';
import { appConfig } from '@/config/app';

class WinstonLogger {
  private readonly logger: winston.Logger;
  constructor() {
    this.logger = createLogger({
      level: loggerConfig.level,
      format: winston.format.json(),
      defaultMeta: { service: appConfig.server.serviceName },
    });

    if (loggerConfig.console.enabled) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple(),
          ),
          level: loggerConfig.console.level,
        }),
      );
    }
  }

  log(message: string): void {
    this.logger.log('info', message);
  }

  info(message: string): void {
    this.logger.info(message);
  }
  warn(message: string): void {
    this.logger.warn(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }
}

export default WinstonLogger;
