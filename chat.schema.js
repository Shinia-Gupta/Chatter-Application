import mongoose from "mongoose";

 const chatSchema=new mongoose.Schema({
    username:String,
    message:String,
    timestamp:{
        type:Date,
    default:Date.now
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})


export const chatModel=mongoose.model('Chat',chatSchema);