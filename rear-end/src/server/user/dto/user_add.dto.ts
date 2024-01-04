import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddUserDto {
  @Type(() => String)
  @IsNotEmpty({ message: '账号不能为空' })
  account;

  @Type(() => String)
  @IsNotEmpty({ message: '用户名不能为空' })
  nick_name;

  @Type(() => String)
  @IsNotEmpty({ message: '密码不能为空' })
  password;

  @Type(() => String)
  avatar;
}