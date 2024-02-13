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
  UserRepository: Symbol.for('UserRepository'),

  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  OfferRepository: Symbol.for('OfferRepository'),

  CityModel: Symbol.for('CityModel'),
  CityService: Symbol.for('CityService'),
  CityRepository: Symbol.for('CityRepository'),

  ReviewModel: Symbol.for('ReviewModel'),
  ReviewService: Symbol.for('ReviewService'),
  ReviewRepository: Symbol.for('ReviewRepository'),
} as const;
