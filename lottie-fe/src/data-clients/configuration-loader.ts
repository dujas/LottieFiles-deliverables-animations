import { HttpClient } from "./http-client";
import BrowserStorage from "./browser-storage";

export interface IConfigurationLoader<Configuration> {
  getConfig(version?: string): Promise<Configuration>;
}

export class ConfigurationLoader<Configuration>
  implements IConfigurationLoader<Configuration>
{
  private httpClient: HttpClient;
  // Create hashmap of configuration with version as key, for multiple version support
  private configuration: Configuration | null = null;
  private fileName: string;
  browserStorage: BrowserStorage<Configuration | null>;

  constructor(fileName: string, httpClient?: HttpClient) {
    this.httpClient = httpClient ?? new HttpClient("anonymous");
    this.fileName = fileName;
    this.browserStorage = BrowserStorage.getInstance();
  }

  async getConfig(version = "latest"): Promise<Configuration> {
    if (!this.configuration) {
      this.configuration = await this.httpClient.get<Configuration>(
        `/${this.fileName}?version=${version}`,
      );
      this.browserStorage.set({
        key: "configuration",
        value: this.configuration,
      });
    }
    return this.configuration;
  }
}
