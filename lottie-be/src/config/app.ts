import { getEnv } from '@/utils/core/env';

export const appConfig = {
  env: getEnv('ENV', 'development'),
  server: {
    port: Number(getEnv('PORT', '8080')),
    serviceName: getEnv('SERVICE_NAME'),
  },
  api: {
    defaultPaginationLimit: Number(getEnv('API_DEFAULT_PAGINATION_LIMIT', '20')),
  },
  cors: {
    origin: getEnv('CORS_ORIGIN', 'http://localhost:8080'),
  },
  db: {
    // username: getEnv('DB_USERNAME'), // TODO
    // host: getEnv('DB_HOST'), // not needed
    connectionString: getEnv('DB_CONNECTION_STRING'),
    // password: getEnv('DB_PASSWORD'), // TODO
    database: getEnv('DB_NAME'),
    // port: getEnv('DB_PORT'), // not needed
    ssl: getEnv('DB_SSL', 'true') === 'true',
    debug: getEnv('DB_DEBUG', 'false') === 'true',
  },
  aws: {
    roleArn: getEnv('AWS_S3_ROLE_ARN'),
    sessionName: getEnv('AWS_S3_SESSION_NAME'),
  },
} as const;
