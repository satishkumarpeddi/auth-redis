import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import cacheService from "../services/cache.service.js";


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

export default signup