import {Offer, OfferType} from '../types/offer.type.js';

function tsvOffersParse(tsvString: string): Offer[] {
  return tsvString
    .split('\n')
    .filter((row) => row.length > 0)
    .map((line) => line.split('\t'))
    .map(([title, description, publicDate, cityName, cityLocationLatitude, cityLocationLongitude,
      previewImage, images, isPremium, isFavorite, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatarUrl, hostPassword, hostIsPro, offerLocationLatitude, offerLocationLongitude]) => ({
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
      isPremium: Boolean(isPremium),
      isFavorite: Boolean(isFavorite),
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
        isPro: Boolean(hostIsPro)
      },
      location: {
        latitude: Number(offerLocationLatitude),
        longitude: Number(offerLocationLongitude)
      }
    }));
}

export {tsvOffersParse};
