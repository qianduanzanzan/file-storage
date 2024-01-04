import { Module } from '@nestjs/common';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './server/user/user.module';
import { UserEntity } from './server/user/user.entity';
import { FileStrongeManageEntity } from './server/file-stronge-manage/file-stronge-manage.entity';
import { FileStrongeManageModule } from './server/file-stronge-manage/file-stronge-manage.module';

import { LoginModule } from './server/login/login.module';

import { MYSQL_CONFIG_DEV } from './config/mysql.config'

import { ValidationPipe } from './pipe/validation.pipe';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { APP_INTERCEPTOR,APP_PIPE } from '@nestjs/core';
 
 
 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: MYSQL_CONFIG_DEV.type,
      host: MYSQL_CONFIG_DEV.host,
      port: MYSQL_CONFIG_DEV.port,
      username: MYSQL_CONFIG_DEV.username,
      password: MYSQL_CONFIG_DEV.password,
      database: MYSQL_CONFIG_DEV.database,
      entities: [
        UserEntity,
        FileStrongeManageEntity
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
     UserModule,
     LoginModule,
     FileStrongeManageModule
  ],
  
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ],
})
export class AppModule {}
