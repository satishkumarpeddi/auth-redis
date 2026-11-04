
import redisClient from '../config/redis.js';


const getCache = async(key) =>{
    try{
        const data = await redisClient.get(key)

        if(!data)
            return null;

        return JSON.parse(data);
    }catch(error){
        console.error("Redis GET error:",error.message);
        return null;
    }
}

const setCache = async(key,value,ttl=60) =>{ 

    try{
        const jitter = Math.floor(Math.random()*10)
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX:ttl+jitter
            }
        )
        return true;
    }catch(error){
        console.error("Redis SET error:",error.message)
        return false;
    }
}

const deleteCache = async(key) =>{
    try{
        await redisClient.del(key)
        return true;
    }catch(error){
        console.error("Redis DELETE error:",error.message);
        return false;
    }
}

export default  {getCache,setCache,deleteCache}