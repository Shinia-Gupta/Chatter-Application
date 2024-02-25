import mongoose from "mongoose";

 const userSchema=new mongoose.Schema({
    username:String,
    socketid:String,
    imageUrl:String
})


export const userModel=mongoose.model('User',userSchema);