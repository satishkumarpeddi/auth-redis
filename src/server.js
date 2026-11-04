import express from 'express'
import redisClient from './config/redis.js'
import authRouter from './routes/auth.routes.js'
import 'dotenv/config'
const app = express();

app.use(express.json());
app.use('/api/auth',authRouter)
const startServer = async () =>{
    try{
        await redisClient.connect();
    
        app.listen(process.env.PORT,"0.0.0.0",()=>{
            console.log("Server is running on port : ",process.env.PORT)
        })
    }catch(error){
        console.error(error);
        process.exit(1)
    }
}

startServer()