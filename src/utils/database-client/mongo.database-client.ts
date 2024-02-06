import {Component} from '#src/types/component.enum.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import * as Mongoose from 'mongoose';
import {Error} from 'mongoose';
import {setTimeout} from 'node:timers/promises';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose?: typeof Mongoose;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
  }

  get isConnected(): boolean {
    return this.mongoose?.connection.readyState === 1;
  }

  public async connect(uri: string, retryCount: number, retryTimeout: number): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client already connected');
    }

    let attempt = 1;
    while (attempt <= retryCount) {
      try {
        this.logger.info(`Trying to connect to MongoDB (${attempt} from ${retryCount})...`);
        this.mongoose = await Mongoose.connect(uri);
        this.logger.info('Database connection established');
        console.log(uri);
        this.mongoose.set('debug', true);

        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(retryTimeout);
      }
    }
    throw new Error(`Unable to establish database connection after ${retryCount--}`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected || !this.mongoose) {
      throw new Error('MongoDB client not connected to the database');
    }

    await this.mongoose.disconnect();
    this.logger.info('Database connection closed');
  }

  //todo не получился статик из-за implements DatabaseClient
  public getURI(username: string, password: string, host: string, port: string, databaseName: string): string {
    return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
  }
}
