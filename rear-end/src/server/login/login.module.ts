import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogonController } from './login.controller';
import { UserEntity } from '../user/user.entity';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/utils/jwt.strategy';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'abcdefg', // 密钥
      signOptions: { expiresIn: '24h' }, // token 过期时效
    }),
  ],
  controllers: [LogonController],
  providers: [LoginService,JwtStrategy]
})
export class LoginModule {}
