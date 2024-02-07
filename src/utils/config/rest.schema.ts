import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_RETRY_COUNT: number;
  DB_RETRY_TIMEOUT: number;
  AVATAR_DEFAULT_URL: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: null
  },
  DB_RETRY_COUNT: {
    doc: 'The number of times to retry the database connection (MongoDB)',
    format: Number,
    env: 'DB_RETRY_COUNT',
    default: null
  },
  DB_RETRY_TIMEOUT: {
    doc: 'The timeout in milliseconds between database connection retry attempts (MongoDB)',
    format: Number,
    env: 'DB_RETRY_TIMEOUT',
    default: null
  },
  AVATAR_DEFAULT_URL: {
    doc: 'Default ulr for user avatar',
    format: String,
    env: 'AVATAR_DEFAULT_URL',
    default: null,
  },
});
