import { getEnv } from '@/utils/core/env';

export const loggerConfig = {
  level: getEnv('LOG_LEVEL', 'info'),
  console: {
    enabled: getEnv('LOG_USE_CONSOLE', 'false') === 'true',
    level: getEnv('LOG_LEVEL', 'info'),
  },
};
