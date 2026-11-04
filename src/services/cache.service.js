
import redisClient from '../config/redis.js';


const getCache = async(key) =>{
    const data = await redisClient.get(key)

    if(!data)
        return null;

    return JSON.parse(data);
}

const setCache = async(key,value,ttl=60) =>{ 
    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX:ttl
        }
    )
}

const deleteCache = async(key) =>{
    await redisClient.del(key)
}

export default  {getCache,setCache,deleteCache}