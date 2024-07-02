import { MikroORM, RequestContext } from '@mikro-orm/mongodb';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';

export const mikroOrmMiddleware = (): RequestHandler => {
  return async (_req, _res, next) => {
    // Fork entity manager at each request for a clean identity map
    RequestContext.create(container.resolve(MikroORM).em, next);
  };
};
