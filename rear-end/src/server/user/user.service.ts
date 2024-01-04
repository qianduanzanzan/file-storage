import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Not, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserPageDto } from './dto/user_page.dto';

import { PAGE_INTERFACE } from 'src/interface/page.interface';
import { UpdateUserDto } from './dto/user_update.dto';
import * as fs from 'fs';
import * as path from 'path';
import { ChangePasswordDto } from './dto/change_password.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }
    // 分页查询用户(暂时没用)
    async getUserByPage(userPageDto: UserPageDto): Promise<PAGE_INTERFACE<UserEntity[]>> {
        let { page_no = 1, page_size = 20, nick_name = '' } = userPageDto;
        const [list, total] = await this.userRepository.findAndCount({
            skip: (page_no - 1) * page_size,
            take: page_size,
            order: {
                createdAt: "ASC"
            },
            where: {
                nick_name: Like(`%${nick_name}%`),
            }
        })
        return {
            data: list,
            total,
            pages: Math.ceil(total / page_size)
        }
    }

    // 根据id查询用户(暂时没用)
    async findOne(id: string): Promise<any> {
        const data = await this.userRepository.findOne({
            where: {
                id: id,
            }
        })
        if(data){
            return {
                ok: true,
                data: data
            }
        }else{
            return {
                ok: false,
                msg: '未查询到用户信息'
            }
        }
    }

    //  新增用户
    async addUser(userPageDto,avatar): Promise<any> {
        console.log(userPageDto)
        const accountEx = await this.userRepository.findOne({
            where:{
                account: userPageDto.account
            }
        })
        console.log(accountEx)
        if(accountEx){
            return {
                msg: '该账号已存在',
                ok: false
            }
        }
        let avatarPath = null
        if(avatar){
            const fileNameArr = avatar.originalname.split('.')
            const fileName = new Array(2).fill(null)
            fileName[1] = fileNameArr.pop()
            fileName[0] = fileNameArr.join('.')
            const now = new Date().valueOf()
            const filePath = path.join(__dirname, '..', '../../avatar', `${now}.${fileName[1]}`)
            const writeStream = fs.createWriteStream(filePath)
            writeStream.write(avatar.buffer)
            writeStream.close()
            avatarPath = `http://127.0.0.1:3001/file-stronge-manage/get-avatar/${now}.${fileName[1]}`
            // avatarPath = `http://124.70.25.229:3000/file-stronge-manage/get-avatar/${now}.${fileName[1]}`
        }
        const data = await this.userRepository.save({ ...userPageDto,avatar:avatarPath, status: 1,is_admin: 0 })
        if(data){
            return {
                data,
                ok: true
            }
        }else{
            return {
                msg: '注册失败',
                ok: true
            }
        }
    }
    // 修改用户信息
    async updateUser(updateUserDto:UpdateUserDto,avatar):Promise<any>{
        let avatarPath = ''
        if(avatar){
            const fileNameArr = avatar.originalname.split('.')
            const fileName = new Array(2).fill(null)
            fileName[1] = fileNameArr.pop()
            fileName[0] = fileNameArr.join('.')
            const now = new Date().valueOf()
            const filePath = path.join(__dirname, '..', '../../avatar', `${now}.${fileName[1]}`)
            const writeStream = fs.createWriteStream(filePath)
            writeStream.write(avatar.buffer)
            writeStream.close()
            avatarPath = `http://127.0.0.1:3001/file-stronge-manage/get-avatar/${now}.${fileName[1]}`
        }
        const {id,...data} = updateUserDto
        let affect = null
        if(avatarPath){
            const { affected } = await this.userRepository.update(id, {nick_name: data.nick_name,avatar:avatarPath})
            affect = affected
        }else{
            const { affected } = await this.userRepository.update(id, {nick_name: data.nick_name})
            affect = affected
        }
        
        if (affect) {
            return {
                ok: true,
                msg: '修改成功'
            };
        } else {
            return {
                ok: false,
                msg: '修改失败'
            };
        }
    }

    //  删除用户(暂时没用)
    async delUser(id): Promise<any> {
        const { affected } = await this.userRepository.update(id, { status: 0 })
        if (affected) {
            return {
                ok: true,
                msg: '删除成功'
            };
        } else {
            return {
                ok: false,
                msg: '删除失败'
            };
        }
    }

    // 修改密码
    async changePassword(changePasswordDto: ChangePasswordDto) {
        if(changePasswordDto.new_password === changePasswordDto.confirm_password){
            const data = await this.userRepository.findOne({
                where: {
                    id: changePasswordDto.user_id,
                    password: changePasswordDto.old_password
                }
            })
            if(data){
                await this.userRepository.update(changePasswordDto.user_id, {password: changePasswordDto.new_password})
                return {
                    ok: true,
                    msg: '修改成功'
                };
            }else{
                return {
                    ok: false,
                    msg: '原密码错误'
                };
            }
        }else{
            return {
                ok: false,
                msg: '新密码与确认密码不一致'
            };
        }
        
    }
}
