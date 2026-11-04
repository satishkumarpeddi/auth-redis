import mongoose from 'mongoose'
import 'dotenv/config'

mongoose.connect(process.env.MONGOOSE_URL).then(()=>
console.log("Connected to mongodb")).catch((error)=>{
    console.log("Error in connecting to the mongodb")
})

export default mongoose