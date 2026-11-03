import { createClient } from "redis";
import 'dotenv/config'
const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on('error',(error)=>{
    console.log("Error is connecting the Redis: ",error);
})

redisClient.on('connect',()=>{
    console.log("Connecting the Redis.")
})

redisClient.on('ready',()=>{
    console.log("Redis Connection is ready.");
})

export default redisClient;