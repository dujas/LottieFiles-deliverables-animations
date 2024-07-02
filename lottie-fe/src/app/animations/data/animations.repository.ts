import { AnimationType } from "../domain/animation-entity";

export type AnimationsAWSCredentialsResultType = {
  getAWSCredentials: {
    AccessKeyId: string;
    SecretAccessKey: string;
    SessionToken: string;
    Expiration: Date;
  };
};

export type SearchAnimationsVariables = {
  first: number; // number of items return in page
  name?: string;
  tags?: string;
  after?: string;
};

export type AnimationsResultType = {
  animations: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    totalCount: number;
    edges: Array<{ node: AnimationType; cursor: string }>;
  };
};

export type AnimationQueryResult = {
  animationById: AnimationType | null;
};

export type AnimationAddVariables = {
  name: string;
  tags: string;
  src: string;
};

export type AnimationAddResult = {
  animation: AnimationType | null;
};
export abstract class AnimationsRepository {
  abstract getAWSCredentials(): Promise<AnimationsAWSCredentialsResultType>;

  abstract searchAnimations(
    variables: SearchAnimationsVariables,
  ): Promise<AnimationsResultType>;

  abstract getAnimationById(id: string): Promise<AnimationQueryResult>;

  abstract addAnimation(
    variables: AnimationAddVariables,
  ): Promise<AnimationAddResult>;
}
