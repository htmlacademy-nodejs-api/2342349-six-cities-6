export const Component = {
  RestApplication: Symbol.for('RestApplication'),

  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Crypto: Symbol.for('Crypto'),

  OfferGenerator: Symbol.for('OfferGenerator'),
  OfferParser: Symbol.for('OfferParser'),
  FileWriter: Symbol.for('FileWriter'),
  FileReader: Symbol.for('FileReader'),


  CliApplication: Symbol.for('CliApplication'),

  GenerateCommand: Symbol.for('GenerateCommand'),
  HelpCommand: Symbol.for('HelpCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  VersionCommand: Symbol.for('VersionCommand'),

  DatabaseClient: Symbol.for('DatabaseClient'),

  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),

  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),

  LocationModel: Symbol.for('LocationModel'),
  LocationService: Symbol.for('LocationService'),

  CityModel: Symbol.for('CityModel'),
  CityService: Symbol.for('CityService'),

  ReviewModel: Symbol.for('ReviewModel'),
  ReviewService: Symbol.for('ReviewService'),
} as const;
