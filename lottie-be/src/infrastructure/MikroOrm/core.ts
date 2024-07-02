import { MikroORM } from '@mikro-orm/mongodb';
import MikroORRMConfig from './config';

export const initializeMikroOrm = async (): Promise<MikroORM> => {
  return MikroORM.init(MikroORRMConfig);
};
