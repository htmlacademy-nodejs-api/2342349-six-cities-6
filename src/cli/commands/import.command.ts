import {BaseCommand} from '#src/cli/commands/base-command.js';
import {fileRead} from '#src/utils/file-read.js';
import {tsvOffersParse} from '#src/utils/tsv-offers-parse.js';

export class ImportCommand extends BaseCommand {
  public async execute(...parameters: string[]): Promise<void> {
    await this.parseFileList(parameters);
  }

  private async parseFileList(fileList: string[]) {
    for (const file of fileList) {
      const rawFileContent = await fileRead(file);
      const offers = tsvOffersParse(rawFileContent);
      console.log(offers);
    }
  }

  get name(): string {
    return '--import';
  }
}
