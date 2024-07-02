import { defineConfig } from '@mikro-orm/mongodb';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { appConfig } from '@/config/app';
import { Animations } from '@/application/models/animations/Animations';

export default defineConfig({
  entities: [Animations],
  clientUrl: appConfig.db.connectionString,
  dbName: appConfig.db.database,
  highlighter: new MongoHighlighter(),
  debug: appConfig.db.debug,
});
