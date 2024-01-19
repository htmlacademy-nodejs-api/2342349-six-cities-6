import {FileWriter} from '#src/offers/writer/file-writer.interface.js';
import {createWriteStream, WriteStream} from 'node:fs';

export class TsvFileWriter implements FileWriter {
  private stream: WriteStream | undefined;

  createStream(filename: string): void {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      autoClose: true,
    });
  }

  public async write(row: string): Promise<unknown> {
    if (!this.stream) {
      throw new Error('Stream not initialized. Call createStream first.');
    }

    const stream = this.stream;
    const writeSuccess = this.stream.write(`${row}\n`);
    if (!writeSuccess) {
      return new Promise((resolve) => {
        stream.once('drain', () => resolve(true));
      });
    }

    return Promise.resolve();
  }
}
