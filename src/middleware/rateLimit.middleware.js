import redisClient from "../config/redis.js";


const rateLimit = async(req,res,next) => {
    try{
        const ip = req.ip;

        const key = `ratelimit:signin:${ip}`

        const attempts = await redisClient.incr(key)

        if(attempts===1)
            await redisClient.expire(key,60)
        if(attempts>5){
            const ttl = await redisClient.ttl(key)

            return res.status(429).json({
                message:"Too many sigin attempts. Try again later.",
                retryAfter:ttl
            })
        }
        next();
    }catch(error){
        console.error("Rate limit error:",error.message)

        return res.status(503).json({
            message:"Authentication service temporarily unavailable"
        })
    }
}

export default rateLimit;