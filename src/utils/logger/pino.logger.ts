import {Logger} from '#src/utils/logger/logger.interface.js';
import {injectable} from 'inversify';
import path from 'node:path';
import {Logger as PinoInstance, pino} from 'pino';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor(private readonly logFilePath: string = 'logs/rest.log') {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const devTransports = [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          translateTime: 'SYS:standard'
        }
      },
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: path.resolve(this.logFilePath),
          mkdir: true,
          append: true
        }
      }
    ];

    const prodTransports = [
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: path.resolve(this.logFilePath),
          mkdir: true,
          append: true
        }
      }
    ];

    this.logger = pino({
      level: isDevelopment ? 'debug' : 'info',
      transport: {
        targets: isDevelopment ? devTransports : prodTransports
      }
    });
    this.logger.info('Logger created…');
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
