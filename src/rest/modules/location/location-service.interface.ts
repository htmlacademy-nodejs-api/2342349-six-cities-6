import {LocationEntity} from '#src/rest/modules/location/location.entity.js';
import {Location} from '#src/rest/modules/location/location.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface LocationService {
  fineOrCreate(locationData: Location): Promise<DocumentType<LocationEntity>>;

  findById(id: number): Promise<DocumentType<LocationEntity> | null>;

  findByCoordinates(cityLongitude: number, cityLatitude: number): Promise<DocumentType<LocationEntity> | null>;
}
