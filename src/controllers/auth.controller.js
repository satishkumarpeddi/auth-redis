import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import cacheService from "../services/cache.service.js";
import jwt from 'jsonwebtoken'

const signup = async (req,res) => {
    try{    
        const {username,email,password} = req.body;

        const existingUser = await UserModel.findOne({email});

        // console.log(existingUser)

        if(existingUser){
            return res.status(409).json({
                messsage:"User already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password,10);

        const user = await UserModel.create({
            username:username,
            email:email,
            password:hashPassword
        })

        try{
            await cacheService.setCache(
                `auth:user:${email}`,
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
        const cacheKey = `auth:user:${email}`;
        
        let user = null;

        try{
            user = await cacheService.getCache(cacheKey)

            if(user){
                console.log("CACHE HIT");
            }else{
                console.log("CACHE MISS");
            }
        }catch(error){
            console.error("Redis GET failed:",error.message)
        }
        if(!user){
            user = await UserModel.findOne({email});

            await cacheService.setCache(
                `auth:user:${email}`,
                {
                    id:user._id.toString(),
                    username:user.username,
                    email:user.email,
                    password:user.password,
                },
                60
            )
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)


        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }

        const token = jwt.sign({id:user._id.toString},process.env.JWT_SECRET,{expriesIn:"1d"})

        return res.status(200).json({
            message:"Signin successfully",
            token:token,
            user:{
                id:user._id,
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

export default {signup,signin}