import { DependencyContainer } from 'tsyringe';

declare module 'express-serve-static-core' {
  interface Request {
    container: DependencyContainer;
  }
}
