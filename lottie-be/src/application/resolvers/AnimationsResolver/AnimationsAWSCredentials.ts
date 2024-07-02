import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
class AnimationsAWSCredentials {
  @Field()
  AccessKeyId!: string;

  @Field()
  SecretAccessKey!: string;

  @Field()
  SessionToken!: string;

  @Field()
  Expiration!: Date;
}

export default AnimationsAWSCredentials;
