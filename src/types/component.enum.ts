export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),

  OfferGenerator: Symbol.for('OfferGenerator'),
  OfferParser: Symbol.for('OfferParser'),
  FileWriter: Symbol.for('FileWriter'),
  FileReader: Symbol.for('FileReader'),

  GenerateCommand: Symbol.for('GenerateCommand'),
  HelpCommand: Symbol.for('HelpCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  VersionCommand: Symbol.for('VersionCommand'),
  CliApplication: Symbol.for('CliApplication'),

  DatabaseClient: Symbol.for('DatabaseClient'),
} as const;
