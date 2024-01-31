import {GENERATOR_CONFIG} from '#src/offers/generator/generator-config.js';
import {OfferGenerator} from '#src/offers/generator/offer-generator.interface.js';
import {MockServerData} from '#src/types/mock-server-data.type.js';
import {getRandomItem, getRandomItems, getRandomNumber} from '#src/utils/random.js';
import dayjs from 'dayjs';
import {injectable} from 'inversify';

@injectable()
export class TsvOfferGenerator implements OfferGenerator {
  public generate(mockData: MockServerData): string {
    const title = getRandomItem(mockData.titles);
    const description = getRandomItem(mockData.descriptions);
    const publicDate = dayjs()
      .subtract(getRandomNumber(GENERATOR_CONFIG.FIRST_WEEK_DAY, GENERATOR_CONFIG.LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(mockData.cities);
    const previewImage = getRandomItem(mockData.previewImages);
    const images = getRandomItems(mockData.images).join(';');
    const isPremium = getRandomItem(mockData.isPremium);
    const isFavorite = getRandomItem(mockData.isFavorite);
    const rating = getRandomNumber(GENERATOR_CONFIG.MIN_RATING, GENERATOR_CONFIG.MAX_RATING);
    const type = getRandomItem(mockData.types);
    const room = getRandomNumber(GENERATOR_CONFIG.MIN_ROOM, GENERATOR_CONFIG.MAX_ROOM);
    const bedroom = getRandomNumber(GENERATOR_CONFIG.MIN_BEDROOM, GENERATOR_CONFIG.MAX_BEDROOM);
    const price = getRandomNumber(GENERATOR_CONFIG.MIN_PRICE, GENERATOR_CONFIG.MAX_PRICE);
    const goods = getRandomItems(mockData.goods).join(';');
    const hostName = getRandomItem(mockData.hostNames);
    const hostEmail = getRandomItem(mockData.hostEmails);
    const hostAvatar = getRandomItem(mockData.hostAvatarUrls);
    const hostPassword = getRandomItem(mockData.hostPasswords);
    const hostType = getRandomItem(mockData.hostTypes);
    const location = getRandomItem(mockData.locations);

    return [
      title, description, publicDate, city.name, city.location.latitude, city.location.longitude,
      previewImage, images, isPremium, isFavorite, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatar, hostPassword, hostType, location.latitude, location.longitude
    ].join('\t');
  }

}
