const mongoose = require ('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
 name:{
  type:String,
  required:true
 },
 email:{
  type:String,
  required:true
 },
 password:{
  type:String,
  required:true
 },
 resetToken:String,
 expireToken:Date,
 followers:[{type:ObjectId,ref:"User"}],
 following:[{type:ObjectId,ref:"User"}],
 pic:{
  type:String,
  default:"https://res.cloudinary.com/instagramclonecloud/image/upload/v1623279427/no-user-image-square_y12dqr.jpg"
 }
})
// mongoose.model("User",userSchema);
const User = mongoose.model("User",userSchema);
 module.exports=User;