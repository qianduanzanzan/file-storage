import { Controller, Get, Param,Query,Post,Body,Delete,Put,UseGuards, UseInterceptors, UploadedFile, Headers  } from '@nestjs/common';
 
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserPageDto } from './dto/user_page.dto';
import { AddUserDto } from './dto/user_add.dto';
import { UpdateUserDto } from './dto/user_update.dto';
import { ChangePasswordDto } from './dto/change_password.dto';

import { AuthGuard } from '@nestjs/passport';
import { PAGE_INTERFACE } from 'src/interface/page.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    // 新增用户
    @Post('add')
    @UseInterceptors(FileInterceptor('avatar'))
    async addUser(@UploadedFile() avatar,@Body()addUserDto:AddUserDto):Promise<any> {
        return await this.userService.addUser(addUserDto,avatar)
    }
    // 删除用户(暂时没用)
    @UseGuards(AuthGuard('jwt'))
    @Delete('del')
    async deleteUser(@Body('id') id: string):Promise<any> {
        return await this.userService.delUser(id)
    }
    // 修改用户
    @Put('update')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar'))
    async updateUser(@UploadedFile() avatar,@Body() updateUserDto: UpdateUserDto):Promise<any> {
        return await this.userService.updateUser(updateUserDto,avatar)
    }
    // 获取用户分页 (暂时没用)
    @Get('get_user_page')
    async getUserPage(@Query()userPageDto:UserPageDto):Promise<PAGE_INTERFACE<UserEntity[]>> {
        return await this.userService.getUserByPage(userPageDto)
    }
    // 根据id返回对应数据(暂时没用)
    @Get('get_one')
    async findOne(@Query('id') params: string,): Promise<UserEntity> {
        return await this.userService.findOne(params)
    }

    // 根据id返回对应数据
    @Get('get_user_info_from_token')
    @UseGuards(AuthGuard('jwt'))
    async getUserInfoFromToken(@Query('user_id') user_id: string,): Promise<UserEntity> {
        return await this.userService.findOne(user_id)
    }

    // 修改用户密码
    @Post('change_password')
    @UseGuards(AuthGuard('jwt'))
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return await this.userService.changePassword(changePasswordDto)
    }
}
