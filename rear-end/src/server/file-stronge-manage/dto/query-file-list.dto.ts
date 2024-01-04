import { Type } from 'class-transformer';

export class QueryFileListDto {
  @Type(() => String)
  pid;

  @Type(() => String)
  name;
}