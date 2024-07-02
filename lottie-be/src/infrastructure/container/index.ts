import { container } from 'tsyringe';
import { MikroORM, MongoEntityManager } from '@mikro-orm/mongodb';
import { initializeMikroOrm } from '../MikroOrm/core';

const registerServices = async (): Promise<void> => {
  const orm = await initializeMikroOrm();
  container.registerInstance(MikroORM, orm);
  const ORM = container.resolve(MikroORM);
  container.registerInstance(MongoEntityManager, ORM.em as MongoEntityManager);
};

export default registerServices;
