import { gql, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  AnimationsRepository,
  SearchAnimationsVariables,
  AnimationsResultType,
  AnimationQueryResult,
  AnimationAddVariables,
  AnimationAddResult,
  AnimationsAWSCredentialsResultType,
} from "./animations.repository";

const ANIMATION_AWS_CREDENTIALS = gql`
  query GetAWSCredentials {
    getAWSCredentials {
      AccessKeyId
      SecretAccessKey
      SessionToken
      Expiration
    }
  }
`;

const SEARCH_ANIMATIONS = gql`
  query SearchAnimations(
    $tags: String
    $name: String
    $after: String
    $first: Int!
  ) {
    animations(tags: $tags, name: $name, after: $after, first: $first) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          name
          tags
          src
          id
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const GET_ANIMATION_BY_ID = gql`
  query GetAnimationById($id: String!) {
    animationById(id: $id) {
      id
      name
      tags
      src
      createdAt
      updatedAt
    }
  }
`;

const ADD_ANIMATION = gql`
  mutation AddAnimation($addAnimation: AddAnimationsInput!) {
    addAnimation(addAnimation: $addAnimation) {
      id
      name
      tags
      src
      createdAt
      updatedAt
    }
  }
`;

// TODO: we can leverage generics so any time in futur we can swap to another graphQL client than Apollo
type AnyGraphQLClient = ApolloClient<NormalizedCacheObject>;

export class AnimationsAdapter extends AnimationsRepository {
  private client: AnyGraphQLClient;

  constructor(graphQLClient: AnyGraphQLClient) {
    super();
    this.client = graphQLClient;
  }

  async getAWSCredentials(): Promise<AnimationsAWSCredentialsResultType> {
    const result = await this.client.query<AnimationsAWSCredentialsResultType>({
      query: ANIMATION_AWS_CREDENTIALS,
    });
    return result.data;
  }

  async searchAnimations(
    variables: SearchAnimationsVariables,
  ): Promise<AnimationsResultType> {
    const result = await this.client.query<
      AnimationsResultType,
      SearchAnimationsVariables
    >({
      query: SEARCH_ANIMATIONS,
      variables,
    });
    return result.data;
  }

  async getAnimationById(id: string): Promise<AnimationQueryResult> {
    const result = await this.client.query<
      AnimationQueryResult,
      { id: string }
    >({
      query: GET_ANIMATION_BY_ID,
      variables: { id },
    });
    return result.data;
  }

  async addAnimation(
    variables: AnimationAddVariables,
  ): Promise<AnimationAddResult> {
    const result = await this.client.mutate<
      AnimationAddResult,
      { addAnimation: AnimationAddVariables }
    >({
      mutation: ADD_ANIMATION,
      variables: { addAnimation: variables },
    });
    if (result.data) {
      return result.data;
    }
    return { animation: null };
  }
}
