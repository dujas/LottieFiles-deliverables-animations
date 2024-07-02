import { ObjectId, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/mongodb';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  readonly _id!: ObjectId;

  @SerializedPrimaryKey()
  @Field(() => ID)
  id!: string;

  @Property()
  @Field(() => Date)
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field(() => Date)
  updatedAt = new Date();
}
