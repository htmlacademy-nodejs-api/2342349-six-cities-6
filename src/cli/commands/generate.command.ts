import {BaseCommand} from '#src/cli/commands/base-command.js';
import {OfferGenerator} from '#src/offers/generator/offer-generator.interface.js';
import {FileWriter} from '#src/offers/writer/file-writer.interface.js';
import {MockServerData} from '#src/types/mock-server-data.type.js';
import {loadDataAsync} from '#src/utils/load-data-async.js';
import chalk from 'chalk';

export class GenerateCommand extends BaseCommand {
  constructor(
    private readonly offerGenerator: OfferGenerator,
    private readonly fileWriter: FileWriter
  ) {
    super();
  }

  private readonly _name = '--generate';

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);
    await this.generateOffers(offerCount, filepath, url);
  }

  private async generateOffers(offerCount: number, filepath: string, url: string): Promise<void> {
    try {
      const mockServerData = await loadDataAsync<MockServerData>(url);
      this.fileWriter.createStream(filepath);
      for (let i = 0; i < offerCount; i++) {
        const offer = this.offerGenerator.generate(mockServerData);
        await this.fileWriter.write(offer);
      }
      console.info(chalk.green(`TSV File '${filepath}' was created with ${offerCount} offers.`));
    } catch {
      console.error(`Can't generate data for ${filepath} with ${url}`);
    }
  }

  get name(): string {
    return this._name;
  }
}
