import { Entity, Property } from '@mikro-orm/mongodb';
import { BaseEntity } from '@/application/models/baseEntity/BaseEntity';
import { Field, ObjectType } from 'type-graphql';
import AnimationsValidator from '@/application/contracts/validators/animations/animations.validator';

@ObjectType()
@Entity()
export class Animations extends BaseEntity {
  @Property()
  @Field()
  name: string;

  @Property()
  @Field()
  tags: string;

  @Property()
  @Field()
  src: string;

  constructor({ name, tags, src }: AnimationsValidator) {
    super();
    this.name = name;
    this.tags = tags;
    this.src = src;
  }
}
