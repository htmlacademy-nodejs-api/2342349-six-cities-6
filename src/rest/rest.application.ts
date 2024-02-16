import {OfferType} from '#src/rest/modules/offer/offer.type.js';
import {ReviewService} from '#src/rest/modules/review/services/review-service.interface.js';
import {UserType} from '#src/rest/modules/user/user.type.js';
import {Component} from '#src/types/component.enum.js';
import {DbParam} from '#src/types/db-param.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    // @inject(Component.CityService) private readonly cityService: CityService,
    // @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
  ) {
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization');
    this.logger.info(`env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');


    //todo
    console.log('TEST');
    // const cityId = '65ca70eca83c67a5ac7d680f';
    // const userId = '65ca70eca83c67a5ac7d6887';
    // const offerId1 = '65ca70eca83c67a5ac7d681a';
    // const offerId2 = '65ca70eca83c67a5ac7d68a6';

    // console.log('findFavoriteByUser');
    // let resultList = await this.offerService.findFavoriteByUser(userId);
    // console.log(resultList);
    //
    // console.log('addFavoriteByUser 1');
    // resultList = await this.offerService.addFavoriteByUser(userId, offerId1);
    // console.log(resultList);
    //
    // console.log('addFavoriteByUser 2');
    // resultList = await this.offerService.addFavoriteByUser(userId, offerId2);
    // console.log(resultList);

    // const resultList = await this.offerService.findByCityWithFavorite(cityId, userId);
    // console.log(resultList);


    const offerReviewId = '65ca70eca83c67a5ac7d681a';
    const review1 = {
      comment: 'aaa123',
      publishDate: new Date(),
      rating: 1,
      author: {
        name: 'Мария Васильева',
        email: 'a2898ef78e901df0a7e3-alexey@example.com',
        avatarUrl: 'avatar5.jpg',
        password: '123',
        type: UserType.pro,
      },
      offer: {
        title: 'Уютная квартира в центре (0a69265093662887e7a7)',
        type: OfferType.apartment,
        bedroom: 1,
        city: {
          name: 'Cologne',
          location: {latitude: 1, longitude: 1}
        },
        description: '.',
        goods: [],
        host: {
          name: 'Мария Васильева',
          email: 'a2898ef78e901df0a7e3-alexey@example.com',
          avatarUrl: 'avatar5.jpg',
          password: '123',
          type: UserType.pro,
        },
        images: [],
        isPremium: true,
        isFavorite: false,
        location: {latitude: 1, longitude: 1},
        previewImage: 'previewImage7.jpg',
        price: 163,
        publicDate: new Date(),
        rating: 3,
        room: 4,
      }
    };

    console.log('[reviewService] findByOffer');
    let resultList = await this.reviewService.findByOffer(offerReviewId);
    // console.log(resultList);

    console.log('[reviewService] findOrCreate');
    const result = await this.reviewService.findOrCreate(review1);
    // console.log(result);

    console.log('[reviewService] findByOffer');
    resultList = await this.reviewService.findByOffer(offerReviewId);
    // console.log(resultList);


    // console.log('TEST');
    // throw new Error('exit');
  }

  private async initDb(): Promise<void> {
    const dbParamVerified: DbParam = {
      dbUser: this.config.get('DB_USER'),
      dbPassword: this.config.get('DB_PASSWORD'),
      dbHost: this.config.get('DB_HOST'),
      dbPort: this.config.get('DB_PORT'),
      dbName: this.config.get('DB_NAME')
    };
    const dbUri = this.databaseClient.getURI(dbParamVerified);

    return this.databaseClient.connect(
      dbUri,
      this.config.get('DB_RETRY_COUNT'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }
}
