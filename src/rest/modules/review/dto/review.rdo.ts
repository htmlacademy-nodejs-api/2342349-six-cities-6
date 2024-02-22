import {OfferRdo} from '#src/rest/modules/offer/dto/offer.rdo.js';
import {Offer} from '#src/rest/modules/offer/type/offer.type.js';
import {UserRdo} from '#src/rest/modules/user/dto/user.rdo.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {Expose, Type} from 'class-transformer';

export class ReviewRdo {
  @Expose()
  public id!: string;

  @Expose({name: 'authorId'})
  @Type(() => UserRdo)
  public author!: User;

  @Expose()
  public comment!: string;

  @Expose({name: 'offerId'})
  @Type(() => OfferRdo)
  public offer!: Offer;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public rating!: number;
}
