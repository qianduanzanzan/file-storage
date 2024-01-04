import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
    @Type(() => String)
    @IsNotEmpty({ message: 'id不能为空' })
    id;

    @Type(() => String)
    @IsNotEmpty({ message: '用户名不能为空' })
    nick_name?;
}