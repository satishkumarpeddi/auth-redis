import jwt from 'jsonwebtoken'
import 'dotenv/config'


const validateSessionTokenJWT = (req,res,next) => {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(404).json({
            message:"Authorized Token not found."
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
        return res.status(401).json({
            message:"Unauthorized access token"
        })
    }

    req.user = decoded
    next();
}catch(error){
    console.error("Authorization token failuer",error.message);
    return res.status(409).json({
        message:"Unprocessable authorization token "
    })
}

}

export default validateSessionTokenJWT