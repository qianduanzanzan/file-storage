import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDto {
  @Type(() => String)
  @IsNotEmpty({message: 'id必传'})
  id;

  @Type(() => String)
  @IsNotEmpty({message: '名称必传'})
  name;
}