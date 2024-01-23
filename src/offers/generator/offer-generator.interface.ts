import {MockServerData} from '#src/types/mock-server-data.type.js';

export interface OfferGenerator {
  generate(mockData: MockServerData): string;
}
