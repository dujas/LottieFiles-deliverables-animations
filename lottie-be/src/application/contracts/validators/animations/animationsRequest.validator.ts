import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class AnimationsRequest {
  @Field()
  @IsNumber()
  first!: number;

  @Field()
  @IsString()
  @IsOptional()
  after?: string;

  @Field()
  @IsString()
  name?: string;

  @Field()
  @IsString()
  tags?: string;
}

export default AnimationsRequest;
