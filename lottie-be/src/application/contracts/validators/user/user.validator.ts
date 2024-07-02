import { IsNumber, IsString, IsOptional, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class UserValidator {
  @Field()
  @IsString()
  @Length(1, 5)
  name!: string;

  @Field()
  @IsString()
  lastname!: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  age?: number;
}

export default UserValidator;
