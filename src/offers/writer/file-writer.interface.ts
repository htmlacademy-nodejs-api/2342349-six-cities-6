export interface FileWriter {
  write(row: string): void;
  createStream(filename: string): void;
}
