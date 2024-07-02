/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from 'cors';
import express, { Express } from 'express';
import http from 'http';
import { container, injectable, InjectionToken } from 'tsyringe';
import { appConfig } from '@/config/app';
import { containerMiddleware } from './middleware/container';
import { errorHandlerMiddleware } from './middleware/errorHandler';
import { mikroOrmMiddleware } from './middleware/mikroOrm';
import { buildSchema } from 'type-graphql';
import { graphqlHTTP } from 'express-graphql';
import { AnimationsResolver } from '@/application/resolvers/AnimationsResolver/AnimationsResolver';
import bodyParser from 'body-parser';

@injectable()
export class ExpressServer {
  server: http.Server | undefined;
  app: Express;

  constructor() {
    this.app = express();
  }

  async startServer(): Promise<void> {
    this.app.use(cors()).use(express.json()).use(containerMiddleware()).use(mikroOrmMiddleware());

    const schema = await buildSchema({
      resolvers: [AnimationsResolver],
      container: { get: (token: InjectionToken) => container.resolve(token) },
    });

    this.app.use(
      '/graphql',
      bodyParser.json(),
      graphqlHTTP((_req, _res) => ({
        schema,
        graphiql: appConfig.env === 'development',
      })),
    );

    this.app.use(errorHandlerMiddleware());

    this.server = http.createServer(this.app);
    this.server.listen(appConfig.server.port);
  }
}
