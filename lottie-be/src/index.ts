import 'reflect-metadata';
import { container } from 'tsyringe';
import { ExpressServer } from '@/infrastructure/server/ExpressServer';
import { logger } from '@/infrastructure/logger';
import { appConfig } from '@/config/app';
import registerServices from './infrastructure/container';

const startServer = async () => {
  await registerServices();
  const web = container.resolve(ExpressServer);

  try {
    await web.startServer();
    logger.log(`Listening to port: ${appConfig.server.port}`);
  } catch (error) {
    logger.error('Server failed to start', error);
  }
};

startServer();
