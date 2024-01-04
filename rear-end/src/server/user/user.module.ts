import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'abcdefg', // 密钥
      signOptions: { expiresIn: '24h' }, // token 过期时效
    })
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
