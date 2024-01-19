import {OfferGenerator} from '#src/offers/generator/offer-generator.interface.js';
import {MockServerData} from '#src/types/mock-server-data.type.js';
import {getRandomItem, getRandomItems, getRandomNumber} from '#src/utils/random.js';
import dayjs from 'dayjs';

export class TsvOfferGenerator implements OfferGenerator {
  private readonly minRating = 1;
  private readonly maxRating = 5;
  private readonly minBedroom = 1;
  private readonly maxBedroom = 6;
  private readonly minRoom = 1;
  private readonly maxRoom = 6;
  private readonly minPrice = 10;
  private readonly maxPrice = 1000;
  private readonly firstWeekDay = 1;
  private readonly lastWeekDay = 7;

  public generate(mockData: MockServerData): string {
    const title = getRandomItem(mockData.titles);
    const description = getRandomItem(mockData.descriptions);
    const publicDate = dayjs()
      .subtract(getRandomNumber(this.firstWeekDay, this.lastWeekDay), 'day')
      .toISOString();
    const city = getRandomItem(mockData.cities);
    const previewImage = getRandomItem(mockData.previewImages);
    const images = getRandomItems(mockData.images).join(';');
    const isPremium = getRandomItem(mockData.isPremium);
    const isFavorite = getRandomItem(mockData.isFavorite);
    const rating = getRandomNumber(this.minRating, this.maxRating);
    const type = getRandomItem(mockData.types);
    const room = getRandomNumber(this.minRoom, this.maxRoom);
    const bedroom = getRandomNumber(this.minBedroom, this.maxBedroom);
    const price = getRandomNumber(this.minPrice, this.maxPrice);
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
