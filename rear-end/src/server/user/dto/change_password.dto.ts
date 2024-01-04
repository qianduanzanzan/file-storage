import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangePasswordDto {
  @Type(() => String)
  @IsNotEmpty({ message: '原密码不能为空' })
  old_password;

  @Type(() => String)
  @IsNotEmpty({ message: '新密码不能为空' })
  new_password;

  @Type(() => String)
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirm_password;

  @Type(() => String)
  user_id;
}