import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { initRedis } from './redis';
import { REDIS_CONFIG_DEV } from 'src/config/redis.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abcdefg',
    });
  }
  
  async validate(payload: any) {
    const redisInstance = await initRedis(REDIS_CONFIG_DEV,'db1')
    const token = await redisInstance.get(payload.id)
    if(token){
        return payload;
    }else{
        return false
    }
    
  }
}
