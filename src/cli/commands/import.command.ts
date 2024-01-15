import {fileRead} from '../../utils/file-read.js';
import {tsvOffersParse} from '../../utils/tsv-offers-parse.js';
import {Command} from './command.interface.js';

export class ImportCommand implements Command {
  public async execute(...parameters: string[]): Promise<void> {
    this.parseFile(parameters);

  }

  public getName(): string {
    return '--import';
  }

  private parseFile(fileList: string[]) {
    fileList.forEach((file) => {
      const rawFileContent = fileRead(file);
      const offers = tsvOffersParse(rawFileContent);
      console.log(offers);
    });
  }
}
