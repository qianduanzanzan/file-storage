import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStrongeManageEntity } from './file-stronge-manage.entity';
import { FileStrongeManageController } from './file-stronge-manage.controller';
import { FileStrongeManageService } from './file-stronge-manage.service';

@Module({
    imports:[TypeOrmModule.forFeature([FileStrongeManageEntity])],
    controllers: [FileStrongeManageController],
    providers:[FileStrongeManageService],

})
export class FileStrongeManageModule {}
