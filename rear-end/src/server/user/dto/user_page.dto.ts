import { Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserPageDto {
  @Type(() => Number)
  @Min(1)
  page_size?: number = 20;

  @Type(() => Number)
  @Min(1)
  page_no?: number = 1;

  @Type(() => String)
  nick_name?: String = '';
}