import { Request, RequestHandler } from 'express';
import { container } from 'tsyringe';

export const containerMiddleware = (): RequestHandler => {
  return (req: Request, _res, next) => {
    req.container = container.createChildContainer();
    next();
  };
};
