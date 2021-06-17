const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin');
const nodemailer= require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
//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

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}))
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
     user.save()
     .then(user=>{
      transporter.sendMail({
        to:user.email,
        from:"no-reply@instagramclone.com",
        subject:"signup success",
        html:"<h1>Welcome to Instagram</h1>"
      })
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

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err)
    }
    console.log(buffer)
    const token = buffer.toString("hex")
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        return res.status(422).json({error:"user dont exists with that email"})
      }
      user.resetToken = token
      user.expireToken= Date.now() + 3600000
      user.save().then((result)=>{
        transporter.sendMail({
          to:user.email,
          from:"no-reply@insta.com",
          subject:"password reset",
          html:`
          <p>You requested for password reset</p>
          <h5>click on this link <a href="http://localhost:3000/reset/${token}"></a>to reset </h5>
          `
        })
        res.json({message:"check your email"})
      })
    })
  })
})
router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})


module.exports = router;