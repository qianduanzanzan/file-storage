import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
// import { LoginEntity } from './login.entity';
import { UserEntity } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { initRedis } from 'src/utils/redis';
import { REDIS_CONFIG_DEV } from 'src/config/redis.config';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    //  登录
    async login(loginDto:LoginDto): Promise<any> {
        const {account,password} = loginDto
        const data = await this.userRepository.findOne({
            where:{
                account,
                password
            }
        })
        let msg;
        if(data){
            if(data.status == 0){
                msg = '登录失败，此账户已被删除'
            }else{
                const payload = {...data,password:undefined}
                const token = this.jwtService.sign(payload)
                const redisInstance = await initRedis(REDIS_CONFIG_DEV,'db1')
                redisInstance.setex(data.id,60 * 60 * 24,token)
                return {
                    ok:true,
                    data:{
                        msg: '登录成功',
                        token: token,
                        ...payload
                    }
                }
            }
        }else{
            msg = '登录失败，账号或密码错误'
        }
        return {
            msg,
            ok:false
        }
    }

    async logout(user_id):Promise<any>{
        const redisInstance = await initRedis(REDIS_CONFIG_DEV,'db1')
        redisInstance.del(user_id)
        return {
            msg: '登出成功',
            ok:true
        }
    }
}
