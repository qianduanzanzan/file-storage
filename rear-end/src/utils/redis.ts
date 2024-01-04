import Redis from 'ioredis';

// import { REDIS_CONFIG_DEV } from 'src/config/redis.config';

const redisObj = {};

export async function initRedis(config,connectName):Promise<Redis>{
    const isExist = redisObj[connectName];
    if(!isExist){
        redisObj[connectName] = await new Redis(config);
    }else{
        if(!["reconnecting","connecting","connect","ready"].includes(redisObj[connectName].status)){
            await redisObj[connectName].connect()
        }
    }
    return redisObj[connectName]
}
