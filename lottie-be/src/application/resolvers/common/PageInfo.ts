import { ObjectType, Field } from 'type-graphql';
@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field(() => String, { nullable: true })
  endCursor!: string | null;
}
