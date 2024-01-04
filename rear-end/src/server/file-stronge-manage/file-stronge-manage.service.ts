import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FileStrongeManageEntity } from './file-stronge-manage.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { QueryFileListDto } from './dto/query-file-list.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class FileStrongeManageService {
    constructor(
        @InjectRepository(FileStrongeManageEntity)
        private readonly fileStrongeRepository: Repository<FileStrongeManageEntity>,
    ) { }

    // 新增文件或文件夹
    async addFileOrFolder(file, data): Promise<any> {
        if (!!Number(data.type)) {
            const fileNameArr = file.originalname.split('.')
            const fileName = new Array(2).fill(null)
            fileName[1] = fileNameArr.pop()
            fileName[0] = fileNameArr.join('.')
            const now = new Date().valueOf()
            const filePath = path.join(__dirname, '..', '../../files', `${now}.${fileName[1]}`)
            const exists = fs.existsSync(filePath)
            if(exists){
                return {
                    msg: '已存在这个文件',
                    ok:false
                }
            }else{
                const writeStream = fs.createWriteStream(filePath)
                writeStream.write(file.buffer)
                writeStream.close()
                const result = await this.fileStrongeRepository.save({
                    name: data.name,
                    pid: data.pid,
                    type: 1,
                    del_status: 1,
                    fileName: `${now}`,
                    suffix: fileName[1],
                    size: file.size,
                    uuid: `${data.pid}-${data.name}-${fileName[1]}`
                })
                return {
                    ok:true,
                    data:result
                }
            }
        } else {
            const result = await this.fileStrongeRepository.save({
                name: data.name,
                pid: data.pid,
                type: 0,
                del_status: 1,
                uuid: `${data.pid}-${data.name}`
            })
            return {
                ok:true,
                data:result
            }
        }
    }

    async getFile(id: string, response: Response) {
        const data = await this.fileStrongeRepository.findOne({
            where: {
                id: id,
                type: 1
            }
        })
        if (data) {
            const filePath = path.join(__dirname, '..', '../../files', `${data.fileName}.${data.suffix}`)
            const exists = fs.existsSync(filePath)
            if (exists) {
                response.download(filePath, `${data.name}.${data.suffix}`, async (e) => {
                    if (e) {
                        throw new Error('文件不存在')
                    }
                })
            } else {
                response.send({
                    ok:false,
                    msg: '文件名称错误'
                })
            }
        } else {
            response.send({
                ok:false,
                msg: 'id错误'
            })
        }
    }

    async getFileList(queryFileListDto: QueryFileListDto) {
        const {pid,name=""} = queryFileListDto
        const data = this.fileStrongeRepository.findOne({
            where:{
                id: pid,
            }
        })
        if(data){
            const result = await this.fileStrongeRepository.find({
                where: {
                    pid: pid,
                    name: Like(`%${name}%`)
                },
                order:{
                    type: 'ASC'
                }
            })
            return {
                ok:true,
                data:result
            }
        }else{
            return {
                ok:true,
                data:[]
            }
        }
    }

    async delFile(id:string) {
        const data = await this.fileStrongeRepository.findOne({
            where:{
                id: id,
            }
        })
        if(data){
            if(data.type == 0){
                const childrenFile = await this.fileStrongeRepository.find({
                    where:{
                        pid: id
                    }
                })
                childrenFile.forEach(item => {
                    this.delFile(item.id)
                })
                const result = await this.fileStrongeRepository.delete({
                    id:id
                })
                return {
                    ok:true,
                    data:result
                }
            }else{
                const fileName = `${data.fileName}.${data.suffix}`
                const filePath = path.join(__dirname, '..', '../../files', fileName)
                const exists = fs.existsSync(filePath)
                if(exists){
                    fs.unlinkSync(filePath)
                }
                const result = await this.fileStrongeRepository.delete({
                    id:id
                })
                return {
                    ok:true,
                    data:result
                }
            }
        }else{
            return {
                ok: false,
                msg: 'id错误'
            }
        }
    }

    async updateFile(updateDto: UpdateDto){
        const {id,name} = updateDto
        let file:any = this.fileStrongeRepository.create({id})
        const data = this.fileStrongeRepository.update(file,{name})
        if(data){
            return {
                ok: true,
                msg: '更新成功'
            }
        }
        return {
            ok: false,
            msg: '更新失败'
        }
    }

    async getAvatar(name: string, response: Response) {
        if (name) {
            const filePath = path.join(__dirname, '..', '../../avatar', name)
            const exists = fs.existsSync(filePath)
            if (exists) {
                response.download(filePath, name, async (e) => {
                    if (e) {
                        response.send({
                            ok:false,
                            msg: '出错'
                        })
                    }
                })
            } else {
                response.send({
                    ok:false,
                    msg: '文件名称错误'
                })
            }
        } else {
            response.send({
                ok:false,
                msg: '文件名称不能为空'
            })
        }
    }
}
