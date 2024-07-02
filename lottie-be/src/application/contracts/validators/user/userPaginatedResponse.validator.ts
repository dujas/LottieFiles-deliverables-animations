import { IsNumber, IsBoolean } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class PaginatedResponse<T> {
  @Field()
  items!: T[];

  @Field()
  @IsBoolean()
  hasNextPage!: boolean;

  @Field()
  @IsNumber()
  totalCount!: number;
}

export default PaginatedResponse;
