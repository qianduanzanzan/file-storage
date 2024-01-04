import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
  @Type(() => String)
  @IsNotEmpty({ message: '账号不能为空' })
  account;

  @Type(() => String)
  @IsNotEmpty({ message: '密码不能为空' })
  password;
}