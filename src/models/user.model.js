import mongoose from "../config/database.js";

const Schema = mongoose.Schema


const User = new Schema({
    username:String,
    email:{type:String,unique:true},
    password:String,
})

const UserModel = mongoose.model('users',User)


export default UserModel;