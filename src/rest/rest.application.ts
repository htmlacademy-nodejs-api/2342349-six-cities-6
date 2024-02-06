import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {OfferService} from '#src/utils/modules/offer/offer-service.interface.js';
import {Offer, OfferType} from '#src/utils/modules/offer/offer.type.js';
import {User, UserType} from '#src/utils/modules/user/user.type.js';
import {inject, injectable} from 'inversify';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization');
    this.logger.info(`env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');

    // todo test1
    const user1: User = {
      name: 'Keks',
      email: `test@email.local${Date.now()}`,
      avatarUrl: 'keks.jpg',
      password: 'Unknown',
      type: UserType.pro
    };
    // const userEntity = new UserEntity(user1, 'passHash');
    // console.log(userEntity);


    // todo test2
    const offer1: Offer = {
      title: 'Комната в современном стиле',
      description: 'Уютная и светлая квартира с новым ремонтом, полностью меблированная. В шаговой доступности от метро и торговых центров.',
      publicDate: new Date('2024-01-26T22:21:56.596Z'),
      city: {
        name: 'Brussels',
        location: {latitude: 50.846557, longitude: 4.351697}
      },
      previewImage: 'previewImage3.jpg',
      images: ['image7.jpg'],
      isPremium: true,
      isFavorite: false,
      rating: 4,
      type: OfferType.house,
      room: 5,
      bedroom: 6,
      price: 91,
      goods: ['Гладильная доска с утюгом', 'aaaaa'],
      host: {
        name: 'Дмитрий Кузнецов',
        email: 'alexey@example.com',
        avatarUrl: 'avatar1.jpg',
        password: 'password5',
        type: UserType.basic
      },
      location: {latitude: 50.937531, longitude: 6.960279}
    };
    // const result = await this.offerService.fineOrCreate(offer1);
    // console.log(result);


  }

  private async initDb(): Promise<void> {
    const dbUri = this.databaseClient.getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(
      dbUri,
      this.config.get('DB_RETRY_COUNT'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }
}
