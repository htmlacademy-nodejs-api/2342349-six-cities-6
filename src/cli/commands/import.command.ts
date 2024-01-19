import {BaseCommand} from '#src/cli/commands/base-command.js';
import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {FileReader} from '#src/offers/reader/file-reader.interface.js';

export class ImportCommand extends BaseCommand {
  private readonly _name = '--import';

  constructor(
    private readonly offerParser: OfferParser,
    private readonly fileReader: FileReader
  ) {
    super();
    this.offerParser = offerParser;
  }

  public async execute(...parameters: string[]): Promise<void> {
    await this.parseFileList(parameters);
  }

  private onImportedLine = (dataLine: string) => {
    const offer = this.offerParser.parserOffer(dataLine);
    console.info(offer);
  };

  private onCompleteImport = (count: number) => {
    console.info(`${count} rows imported.`);
  };

  private async parseFileList(fileList: string[]): Promise<void> {
    for (const file of fileList) {
      this.fileReader.on('line', this.onImportedLine);
      this.fileReader.on('end', this.onCompleteImport);
      try {
        await this.fileReader.read(file);
      } catch {
        console.error(`Can't import data from file: ${file}`);
      }
    }
  }

  get name(): string {
    return this._name;
  }
}
