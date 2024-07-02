import { AnimationType } from "../domain/animation-entity";
import { GraphQLClient } from "@/data-clients/graphql-client";
import {
  AnimationAddVariables,
  SearchAnimationsVariables,
} from "./animations.repository";
import { AnimationsAdapter } from "./animations-adapter";
import { S3Service } from "@/services/S3.service";
import BrowserStorage from "@/data-clients/browser-storage";
import { Configuration } from "@/services/configurationLoader.service";

type SearchAnimationsListType = {
  hasNextPage: boolean;
  endCursor: string; // last cursor of current page use this to query next page
  totalCount: number;
  items: Array<AnimationType>;
};

type AnimationByIdType = {
  tags: string[];
} & Omit<AnimationType, "tags">;

export type UploadAnimationType = {
  Key: string;
  type?: string;
  file: File;
};

export class AnimationsUsecase {
  browserStorage: BrowserStorage<Array<AnimationType> | null>;
  config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    GraphQLClient.setup(this.config.publicApiUrl);
    this.browserStorage = BrowserStorage.getInstance();
  }

  private async getS3Client() {
    return S3Service.getInstance();
  }

  async setupS3Client(): Promise<void> {
    const graphQLClient = GraphQLClient.getInstance();
    const adapter = new AnimationsAdapter(graphQLClient);
    const credentials = await adapter.getAWSCredentials();
    const { s3bucket: bucket, region } = this.config;
    S3Service.setup(bucket, region, credentials.getAWSCredentials);
  }

  // Local storage
  private async filterAndSaveLocally(
    data: Array<AnimationType>,
  ): Promise<void> {
    const localAnimations = this.browserStorage.get(
      this.config.browserStorageKey,
    );
    if (localAnimations) {
      const localAnimationsId = localAnimations.map((x) => x.id);
      const animationsToAdd = data.filter(
        (x) => !localAnimationsId.includes(x.id),
      );
      const updatedLocalAnimations = [...localAnimations, ...animationsToAdd];
      this.browserStorage.set({
        key: this.config.browserStorageKey,
        value: updatedLocalAnimations,
      });
    } else {
      this.browserStorage.set({
        key: this.config.browserStorageKey,
        value: data,
      });
    }
  }

  // Upload file to bucet
  async uploadAnimation({
    Key,
    type,
    file,
  }: UploadAnimationType): Promise<boolean> {
    try {
      const s3Service = await this.getS3Client();
      await s3Service.uploadObject({
        Key,
        ContentType: type ?? "application/json",
        data: file,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  // API
  async searchAnimations(
    variables: SearchAnimationsVariables,
    isOffline?: boolean,
  ): Promise<SearchAnimationsListType> {
    let hasNextPage = false;
    let endCursor = "";
    let totalCount = 0;
    let items: Array<AnimationType> = [];

    if (isOffline) {
      const localAnimations =
        this.browserStorage.get(this.config.browserStorageKey) ?? [];
      const resultAnimations = localAnimations.filter(
        (x) =>
          x.tags.includes(variables?.tags ?? "") ||
          x.name.includes(variables?.name ?? ""),
      );
      items = resultAnimations.slice(0, variables.first + 1);
      const len = items.length;
      hasNextPage = len > variables.first;
      totalCount = len;
      endCursor = len === 0 ? "" : items[len - 1].id;
    } else {
      const graphQLClient = GraphQLClient.getInstance();
      const adapter = new AnimationsAdapter(graphQLClient);

      const s3Service = await this.getS3Client();
      const result = await adapter.searchAnimations(variables);
      // get S3 signed URL
      const edgesWithSignedUrls = await Promise.all(
        result.animations.edges.map(async (x) => {
          const signedUrl = await s3Service.getObjectSignedUrl(x.node.src);
          return {
            ...x,
            node: { ...x.node, src: signedUrl },
          };
        }),
      );
      const resultWithSignedUrls = {
        animations: {
          ...result.animations,
          edges: edgesWithSignedUrls,
        },
      };
      this.filterAndSaveLocally(
        resultWithSignedUrls.animations.edges.map((x) => x.node),
      );

      hasNextPage = resultWithSignedUrls.animations.pageInfo.hasNextPage;
      endCursor = resultWithSignedUrls.animations.pageInfo.endCursor;
      totalCount = resultWithSignedUrls.animations.totalCount;
      items = resultWithSignedUrls.animations.edges.map((x) => x.node);
    }
    return {
      hasNextPage,
      endCursor,
      totalCount,
      items,
    };
  }

  async getAnimationById(
    id: string,
    isOffline?: boolean,
  ): Promise<AnimationByIdType | null> {
    let animation: AnimationType | null = null;
    if (isOffline) {
      const localAnimations = this.browserStorage.get(
        this.config.browserStorageKey,
      );
      if (localAnimations) {
        animation = localAnimations.find((x) => x.id === id) ?? null;
      }
    } else {
      const graphQLClient = GraphQLClient.getInstance();
      const adapter = new AnimationsAdapter(graphQLClient);
      const result = await adapter.getAnimationById(id);
      if (result.animationById) {
        const s3Service = await this.getS3Client();
        const signedUrl = await s3Service.getObjectSignedUrl(
          result.animationById?.src,
        );
        animation = {
          ...result.animationById,
          src: signedUrl,
        };
      }
    }
    if (animation) {
      return {
        ...animation,
        tags: animation.tags.split(","),
      };
    } else {
      return null;
    }
  }

  async addAnimation(
    variables: AnimationAddVariables,
  ): Promise<AnimationType | null> {
    const graphQLClient = GraphQLClient.getInstance();
    const adapter = new AnimationsAdapter(graphQLClient);
    const result = await adapter.addAnimation(variables);
    const animation = result.animation;
    return animation;
  }
}
