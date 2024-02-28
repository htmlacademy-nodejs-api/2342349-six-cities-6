import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';

export class OfferDTO extends CreateOfferDTO {
  public publishDate: Date;

  constructor(publishDate: Date) {
    super();
    this.publishDate = publishDate;
  }
}
