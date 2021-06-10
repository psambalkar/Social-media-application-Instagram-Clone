const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require('../models/post')
const requireLogin = require('../middlewares/requireLogin');
const User= require('../models/user')


router.get('/user/:id',requireLogin,(req,res)=>{
 User.findOne({_id:req.params.id})
 .select('-password')
 .then(user=>{
  Post.find({postedBy:req.params.id})
  .populate("postedBy","_id name")
  .exec((err,posts)=>{
   if(err){ 
    return res.status(422).json({error:err})
   }
   res.json({user,posts})
  })
 }).catch(err=>{
  return res.status(404).json({error:"User not found"})
 })
})
router.put('/follow',requireLogin,(req,res)=>{
 User.findByIdAndUpdate(req.body.followId,{           //followId is the ID of the user to which the loggedin user follows
  $push:{followers:req.user._id}                      //to push the ID of the user loggedin to the followID user
 },{
  new:true
 },(err,result)=>{
  if(err){
   return res.status(422).json({error:err})
  }
  User.findByIdAndUpdate(req.user._id,{
   $push:{following:req.body.followId}
  },{
   new:true
  }).select("-password").then(result=>{
   res.json(result)
  }).catch(err=>{
   return res.status(422).json({error:err})
  })
 })
})
router.put('/unfollow',requireLogin,(req,res)=>{
 User.findByIdAndUpdate(req.body.unfollowId,{           //followId is the ID of the user to which the loggedin user follows
  $pull:{followers:req.user._id}                      //to push the ID of the user loggedin to the followID user
 },{
  new:true
 },(err,result)=>{
  if(err){
   return res.status(422).json({error:err})
  }
  User.findByIdAndUpdate(req.user._id,{
   $pull:{following:req.body.unfollowId}
  },{
   new:true
  }).select("-password").then(result=>{
   res.json(result)
  }).catch(err=>{
   return res.status(422).json({error:err})
  })
 })
})
router.put('/updatepic',requireLogin,(req,res)=>{
 User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(err,result)=>{
  if(err){
   return res.status(422).json({error:"pic cannote be posted"})
  }
  res.json(result)
 })
})
module.exports = router;