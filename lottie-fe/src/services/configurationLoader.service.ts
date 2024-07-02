import { ConfigurationLoader } from "@/data-clients/configuration-loader";

export type Configuration = {
  region: string;
  s3bucket: string;
  publicApiUrl: string;
  browserStorageKey: string;
};

export const EnvironmentConfigurationLoader =
  new ConfigurationLoader<Configuration>("env.json");
