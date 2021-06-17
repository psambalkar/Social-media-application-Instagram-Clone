const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require('../models/post')
const requireLogin = require('../middlewares/requireLogin');

//get all posts 
router.get('/allposts',requireLogin,(req,res)=>{
 Post.find()
 .populate('postedBy',"_id name")
 .sort('-createdAt')
 .then(posts=>{
  res.json({posts})
 })
 .catch(err=>{
  console.log(err)
 })
})
//get all the posts whom the user follows
router.get('/getsubposts',requireLogin,(req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})          //checking in following array if the user is present or not    //checking posted by in following
  .populate('postedBy',"_id name")
  .sort('-createdAt')
  .then(posts=>{
   res.json({posts})
  })
  .catch(err=>{
   console.log(err)
  })
 })


///createPost
router.post('/createpost',requireLogin,(req,res)=>{
  const {body,title,pic} = req.body;
  if(!body || !title || !pic){
   return res.status(422).json({error:"Please add all the fields"})
  }
  req.user.password = undefined
  const post = new Post({
   title,
   body,
   photo:pic,
   postedBy:req.user
  })
  post.save().then(result=>{
   res.json({post:result})
  })
  .catch(err=>{
   console.log(err)
  })
})


//get all the posts of that user 
 router.get("/mypost",requireLogin,(req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name")
  .then(mypost=>{
   res.json({mypost})
  })
  .catch(err=>{
   console.log(err)
  })
 })
module.exports = router;

//for like to update the database we use route 
router.put("/like",requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})
router.put("/unlike",requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})
router.put("/comment",requireLogin,(req,res)=>{
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
    if(err||!post){
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString()===req.user._id.toString()){
     post.remove()
     .then(result=>{
       res.json(result)
     })
     .catch(err=>{
       console.log(err)
     })
    }
  })
})