import { AnimationsRepository } from '@/application/repositories/AnimationsRepository';
import { Arg, Mutation, Query, Resolver, Int } from 'type-graphql';
import { Animations } from '@/application/models/animations/Animations';
import { singleton } from 'tsyringe';
import { NotFoundError } from '@/application/errors/NotFoundError';
import AnimationsConnection from './AnimationsPagination';
import { AddAnimationsInput } from './AddAnimationsInput';
import { BadRequest } from '@/application/errors/BadRequest';
import { logger } from '@/infrastructure/logger';
import { Credentials } from '@aws-sdk/client-sts';
import AnimationsAWSCredentials from './AnimationsAWSCredentials';

@Resolver(Animations)
@singleton()
export class AnimationsResolver {
  constructor(private animationsRepository: AnimationsRepository) {}

  @Query(() => AnimationsAWSCredentials, { nullable: true })
  async getAWSCredentials(): Promise<Credentials | undefined> {
    const credentials = await this.animationsRepository.getAWSCredentials();
    if (!credentials) {
      throw new BadRequest();
    }
    return {
      AccessKeyId: credentials.AccessKeyId!,
      SecretAccessKey: credentials.SecretAccessKey!,
      SessionToken: credentials.SessionToken!,
      Expiration: credentials.Expiration!,
    };
  }

  @Query(() => Animations)
  async animationByName(@Arg('name') name: string): Promise<Animations> {
    const animation = await this.animationsRepository.findByName(name);
    if (!animation) {
      throw new NotFoundError();
    }

    return animation;
  }

  @Query(() => Animations)
  async animationById(@Arg('id') id: string): Promise<Animations> {
    const animations = await this.animationsRepository.findById(id);
    if (!animations) {
      throw new NotFoundError();
    }

    return animations;
  }

  @Query(() => AnimationsConnection)
  async animations(
    @Arg('first', () => Int, { nullable: true }) first = 10,
    @Arg('after', { nullable: true }) after?: string,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('tags', { nullable: true }) tags?: string,
  ): Promise<AnimationsConnection> {
    const { items, hasNextPage, totalCount } = await this.animationsRepository.findPaginated({
      first,
      after,
      name,
      tags,
    });

    const edges = items.map((x) => ({
      node: x,
      cursor: x._id.toString(),
    }));

    const edgesLen = edges.length;

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor: edgesLen > 0 ? edges[edgesLen - 1].cursor : null,
      },
      totalCount,
    };
  }

  @Mutation(() => Animations)
  async addAnimation(
    @Arg('addAnimation') newAnimationsData: AddAnimationsInput,
  ): Promise<Animations> {
    try {
      const animations = new Animations(newAnimationsData);
      await this.animationsRepository.save(animations);
      return animations;
    } catch (err) {
      logger.error(String(err));
      throw new BadRequest();
    }
  }
}
