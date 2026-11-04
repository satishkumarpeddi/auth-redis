import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import cacheService from "../services/cache.service.js";
import jwt from 'jsonwebtoken'
import notificationQueue from "../queues/notification.queue.js"

const signup = async (req,res) => {
    try{    
        const {username,email,password} = req.body;

        
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await UserModel.findOne({email:normalizedEmail});

        // console.log(existingUser)

        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password,10);

        const user = await UserModel.create({
            username:username,
            email:normalizedEmail,
            password:hashPassword
        })

        try{
            await notificationQueue.add(
                "welcome-email",
                {
                    userId:user._id.toString(),
                    username:user.username,
                    email:user.email
                },
                {
                    attempts:3,
                    backoff:{
                        type:"exponential",
                        delay:1000
                    },
                    removeOnComplete:true,
                    removeOnFail:false
                }
            )
        }catch(error){
            console.error("Failed to enqueue welcome notification:",error)
        }
        try{
            await cacheService.setCache(
                `auth:user:${normalizedEmail}`,
                {
                    id:user._id.toString(),
                    username:user.username,
                    email:user.email
                },60
            )
        }catch(error){
            console.error("Redis cache error:",error);
        }


        res.status(201).json({
            message:"Signup successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })
        
    }catch(error){
        return res.status(500).json({
            message:"Signup failed",
            error:error.message,
        })
        }
}

const signin = async (req,res) => {
    try{
        const {email,password} = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const cacheKey = `auth:user:${normalizedEmail}`;
        
        let user = null;
        user = await UserModel.findOne({email}).select("+password");
        if(!user){

            if(!user){
                return res.status(401).json({
                    message:"Invalid email or password"
                })
            }
            const isPasswordValid = await bcrypt.compare(password,user.password)
            if(!isPasswordValid){
                return res.status(401).json({
                    message:"Invalid email or password"
                })
            }

           try{
             await cacheService.setCache(
                cacheKey,
                {
                    id:user._id.toString(),
                    username:user.username,
                    email:user.email
                },
                60
            )
           }catch(error){
            console.error("Redis SET failed:",error.message)
           }
        }



        const token = jwt.sign({id:user._id?.toString()||user.id},process.env.JWT_SECRET,{expiresIn:"1d"})

        return res.status(200).json({
            message:"Signin successfully",
            token:token,
            user:{
                id:user.id,
                username:user.username,
                email:user.email,
            }
        })

    }catch(error){
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}

const changePassword = async(req,res) => {

    try{
        const {oldPassword,newPassword} = req.body;

        const userId = req.user.id;

        const user = await UserModel.findById(userId).select("+password")

        if(!user)   
            return res.status(404).json({
                message:"User not found"
            })

        const isValid =  await  bcrypt.compare(oldPassword,user.password)

        if(!isValid)
            return res.status(401).json({
                message:"Old password is incorrect"
            })
        
        const hashPassword = await bcrypt.hash(newPassword,10)

        user.password = hashPassword;

        await user.save(); // This is used to change the modified data 

        const cacheKey = `auth:user:${user.email}`

        try{
            await cacheService.deleteCache(cacheKey)
        }catch(error){
            console.error("Redis invalidation failed:",error.message)
            return res.status(503).json({
                message:"Password updated,but cache invalidation failed. Please contact support. "
            })
        }

        return res.status(200).json({
            message:"Password changed successfully"
        })

    }catch(error){
        console.error("Password change error:",error);

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export {signin,signup,changePassword}