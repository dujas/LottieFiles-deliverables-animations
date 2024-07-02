import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

export class GraphQLClient {
  private static instance: ApolloClient<NormalizedCacheObject>;
  private static uri: string;

  private constructor() {}

  static setup(uri: string) {
    this.uri = uri;
    return this.getInstance();
  }

  static getInstance() {
    if (!this.uri) {
      throw Error("Missing `uri`. Call method setup with a valid uri");
    }
    if (!this.instance) {
      this.instance = new ApolloClient({
        uri: this.uri,
        cache: new InMemoryCache(),
      });
    }
    return this.instance;
  }
}
