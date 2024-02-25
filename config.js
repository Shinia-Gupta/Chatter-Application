import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url=process.env.DB_URL;
// console.log(url);
const mongourl='mongodb://localhost:27017/chatterApp';
export const connectToDB=async()=>{
await mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
console.log('DB is connected');
}
