const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin');
//signup route 
router.post("/signup",(req,res)=>{
 const {name,email,password,pic} = req.body;
 if(!email || !name || !password){
  return res.status(422).json({
   error:"Please add all the fields"
  })
 }
 User.findOne({email:email}).then((savedUser)=>{
  if(savedUser){
  return res.status(422).json({error:"The User with this email already exists"})
  }
  bcrypt.hash(password,12).then(hashedpassword=>{
     const user = new User({
      email,
      password:hashedpassword,
      name,
      pic

     })
     user.save().then(
      user=>{
       res.json({message:"Saved Successfully"})
      }
     ).catch(err=>{console.log(err)})
    })
  
 }).catch(err=>console.log(err))
})
router.post("/signin",(req,res)=>{
 const {email,password} = req.body
 User.findOne({email:email})
 .then(savedUser=>{
  if(!savedUser){
   return res.status(422).json({
    message:"Invalid email or password"
   })}
   bcrypt.compare(password,savedUser.password)
   .then(doMatch=>{
    if(doMatch){   
     const token = jwt.sign({_id:savedUser._id},JWT_SECRET) //_id is the payload
     const {_id,name,email,followers,following,pic} = savedUser
     res.json({token,user:{_id,name,email,followers,following,pic}})
     // res.status(200).json({            //we would rather send here a jwt token 
     //  message:"Successfully Signed In"     
     // })
    }
     else {
      return res.status(422).json({error:"Invalid email or password"})
     }
   }).catch(err=>console.log(err))
  
 })
})
router.get('/protected',requireLogin,(req,res)=>{
res.status(200).json({message:"successfully opened the protected route"})
})

module.exports = router;