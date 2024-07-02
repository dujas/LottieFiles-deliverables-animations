import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class AnimationsValidator {
  @Field()
  @IsString()
  @Length(1, 5)
  name!: string;

  @Field()
  @IsString()
  tags!: string;

  @Field()
  @IsString()
  src!: string;
}

export default AnimationsValidator;
