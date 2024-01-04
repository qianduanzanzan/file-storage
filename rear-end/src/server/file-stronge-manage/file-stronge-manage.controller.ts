import { Controller, Get, Param, Query, Post, Body, Delete, Put, UseGuards,UploadedFile,Request,UseInterceptors, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileStrongeManageEntity } from './file-stronge-manage.entity';
import { FileStrongeManageService } from './file-stronge-manage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryFileListDto } from './dto/query-file-list.dto';
import { UpdateDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('file-stronge-manage')
export class FileStrongeManageController {
    constructor(
        private readonly fileStrongeManageService: FileStrongeManageService
    ) { }
    // 新增文件（文件夹） 
    @Post('add-file-or-folder')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    async addFile(@UploadedFile() file,@Body()data): Promise<any> {
        return await this.fileStrongeManageService.addFileOrFolder(file,data)
    }
    // 下载文件
    @Get('get-file/:name')
    async getFile(@Param('id')id, @Res() response: Response): Promise<any> {
        return await this.fileStrongeManageService.getFile(id,response)
    }
    // 获取文件列表（包括文件夹）
    @Get('get-file-list')
    @UseGuards(AuthGuard('jwt'))
    async getFileList(@Query() queryFileListDto:QueryFileListDto): Promise<any> {
        return await this.fileStrongeManageService.getFileList(queryFileListDto)
    }
    // 删除文件
    @Delete('del-file')
    @UseGuards(AuthGuard('jwt'))
    async delFile(@Body('id') id:string): Promise<any> {
        return await this.fileStrongeManageService.delFile(id)
    }
    // 修改文件
    @Put('update-file')
    @UseGuards(AuthGuard('jwt'))
    async updateFile(@Body() updateDto: UpdateDto): Promise<any> {
        return await this.fileStrongeManageService.updateFile(updateDto)
    }
    // 获取头像
    @Get('get-avatar/:name')
    async getAvatar(@Param('name')name, @Res() response: Response): Promise<any> {
        return await this.fileStrongeManageService.getAvatar(name,response)
    }
}
