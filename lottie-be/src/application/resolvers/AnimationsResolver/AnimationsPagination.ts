import { ObjectType, Field, Int } from 'type-graphql';
import { Animations } from '@/application/models/animations/Animations';
import { PageInfo } from '../common/PageInfo';

@ObjectType()
class AnimationsEdge {
  @Field(() => Animations)
  node!: Animations;

  @Field(() => String)
  cursor!: string;
}

@ObjectType()
class AnimationsConnection {
  @Field(() => [AnimationsEdge])
  edges!: AnimationsEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field(() => Int)
  totalCount!: number;
}

export default AnimationsConnection;
