import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {Offer, OfferType} from '#src/types/offer.type.js';
import {UserType} from '#src/types/user.type.js';
import {injectable} from 'inversify';

@injectable()
export class TsvOfferParser implements OfferParser {

  private stringToBoolean(str: string) {
    return str === 'true';
  }

  public parserOffer(tsvString: string): Offer {
    const [title, description, publicDate, cityName, cityLocationLatitude, cityLocationLongitude,
      previewImage, images, isPremium, isFavorite, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatarUrl, hostPassword, hostType, offerLocationLatitude, offerLocationLongitude] = tsvString.split('\t');

    return {
      title,
      description,
      publicDate: new Date(publicDate),
      city: {
        name: cityName,
        location: {
          latitude: Number(cityLocationLatitude),
          longitude: Number(cityLocationLongitude)
        }
      },
      previewImage,
      images: images.split(';'),
      isPremium: this.stringToBoolean(isPremium),
      isFavorite: this.stringToBoolean(isFavorite),
      rating: Number(rating),
      type: type as OfferType,
      room: Number(room),
      bedroom: Number(bedroom),
      price: Number(price),
      goods: goods.split(';'),
      host: {
        name: hostName,
        email: hostEmail,
        avatarUrl: hostAvatarUrl,
        password: hostPassword,
        type: hostType as UserType
      },
      location: {
        latitude: Number(offerLocationLatitude),
        longitude: Number(offerLocationLongitude)
      }
    };
  }
}


