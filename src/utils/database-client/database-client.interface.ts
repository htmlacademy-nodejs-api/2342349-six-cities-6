import {DbParam} from '#src/types/db-param.type.js';

export interface DatabaseClient {
  connect(uri: string, retryCount: number, retryTimeout: number): Promise<void>;
  disconnect(): Promise<void>;

  getURI(dbParams: DbParam): string
}
