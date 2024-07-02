import { Animations } from '../models/animations/Animations';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/mongodb';
import { singleton } from 'tsyringe';
import { ObjectId } from '@mikro-orm/mongodb';
import { MongoQuery } from '@/utils/types/Mongo';
import PaginatedResponse from '../contracts/validators/common/paginatedResponse.validator';
import AnimationsRequest from '../contracts/validators/animations/animationsRequest.validator';
import { STSClient, AssumeRoleCommand, Credentials } from '@aws-sdk/client-sts';
import { appConfig } from '@/config/app';

@singleton()
export class AnimationsRepository {
  private repository: EntityRepository<Animations>;
  constructor(private em: EntityManager) {
    this.repository = em.getRepository(Animations);
  }

  async getAWSCredentials(): Promise<Credentials | undefined> {
    const cmd = new AssumeRoleCommand({
      RoleArn: appConfig.aws.roleArn,
      RoleSessionName: appConfig.aws.sessionName,
      DurationSeconds: 3600, // 1 hour
    });
    const stsClient = new STSClient({ region: 'us-west-1' });

    const response = await stsClient.send(cmd);
    return response.Credentials;
  }

  async findByName(name: string): Promise<Animations | null> {
    return this.repository.findOne({ name });
  }

  async findById(id: string): Promise<Animations | null> {
    return this.repository.findOne({ id });
  }

  async save(animations: Animations): Promise<Animations> {
    this.repository.create(animations);
    await this.em.flush();
    return animations;
  }

  async findAll(): Promise<Array<Animations>> {
    return this.repository.findAll();
  }

  async findPaginated({
    first,
    after,
    name,
    tags,
  }: AnimationsRequest): Promise<PaginatedResponse<Animations>> {
    const query: FilterQuery<Animations> = after ? { _id: { $gt: new ObjectId(after) } } : {};
    const _$or: MongoQuery<Animations>[] = [];
    if (name) {
      _$or.push({ name: { $regex: name, $options: 'i' } });
    }
    if (tags) {
      _$or.push({ tags: { $regex: tags, $options: 'i' } });
    }

    if (_$or.length > 0) {
      query['$or'] = _$or;
    }

    const [items, totalCount] = await Promise.all([
      this.repository.find(query, {
        limit: first + 1,
        orderBy: { _id: 'ASC' },
      }),
      this.repository.count(),
    ]);

    const hasNextPage = items.length > first;
    if (hasNextPage) {
      items.pop();
    }
    return {
      items,
      hasNextPage,
      totalCount,
    };
  }
}
