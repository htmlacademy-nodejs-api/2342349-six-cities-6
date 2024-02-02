export interface DatabaseClient {
  connect(uri: string, retryCount: number, retryTimeout: number): Promise<void>;

  disconnect(): Promise<void>;

  getURI(
    username: string,
    password: string,
    host: string,
    port: string,
    databaseName: string,
  ): string
}
