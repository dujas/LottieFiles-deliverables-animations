import { IsString } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class AddAnimationsInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  tags!: string;

  @Field()
  @IsString()
  src!: string;
}
