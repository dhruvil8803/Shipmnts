const express = require('express');
const router = express.Router();
const User = require("../Models/User.js");
const Tweet = require("../Models/Tweet.js");
const validator = require('validator');
const bcrypt = require("bcryptjs");
const sendResponse = require('../Middleware/sendResponse.js');
const error = require('../Middleware/error.js');
const validateEmail = (email)=>{
    return validator.isEmail(email);
}
const validateName = (name)=>{
  return validator.isAlpha(name);
}


router.post("/register", error(async ( req, res, next)=>{
    let {name, email, password} = req.body;
        let response = await User.findOne({email : email});
        if(response){
           return sendResponse(false, "Someone with this email exists please login instead", res);
        }
            if(!validateEmail(email)) return sendResponse(false, "Enter Valid Email", res);
            if(!validateName(name)) return sendResponse(false, "Enter Valid Name", res);
            if(password.length < 8) return sendResponse(false, "Password must contain atleast 8 characters", res);
             password =  await bcrypt.hash(password, 10);
            let user = await User.create({
                name,email, password,
            })
         res.json({
            success: true, 
            message: "User Creation Successfull",
         })
}))


router.post("/tweet", error(async ( req, res, next)=>{
    let {email, desc} = req.body;
        let response = await User.findOne({email : email});
        if(!response){
           return sendResponse(false, "User doesnt Exists", res);
        }
        if(desc.trim().length  > 140){
            return sendResponse(false, "Descreption of tweet must be less than 140 character", res);
        }
        let tweet = await Tweet.create({
            desc, 
            createdBy : response._id
        })
        response.tweets.push({tweetId: tweet._id});
        await response.save();
        
         res.json({
            success: true, 
            message: "Tweet Successfully",
         })
}))
router.post("/comment", error(async ( req, res, next)=>{
     let {email , tweetId, desc} = req.body;
     let user = await User.findOne({email : email});
        if(!user){
           return sendResponse(false, "User doesnt Exists", res);
        }
    let tweet = await Tweet.findOne({_id : tweetId});
    if(!tweet) {
        return sendResponse(false, "No Such tweet Exists" , res);
    }
    tweet.comments.push({
        by: user._id, 
        name: user.name, 
        desc,

    })
    await tweet.save();
    res.json({
        success : true, 
        message : "Commented on the tweet"
    })
}));


router.post("/like", error(async ( req, res, next)=>{
    let {email , tweetId} = req.body;
    let user = await User.findOne({email : email});
       if(!user){
          return sendResponse(false, "User doesnt Exists", res);
       }
   let tweet = await Tweet.findOne({_id : tweetId});
   if(!tweet) {
       return sendResponse(false, "No Such tweet Exists" , res);
   }
   tweet.likes = tweet.likes + 1;
   await tweet.save();
   res.json({
       success : true, 
       message : "Liked a tweet"
   })
}));


router.post("/dislike", error(async ( req, res, next)=>{
    let {email , tweetId} = req.body;
    let user = await User.findOne({email : email});
       if(!user){
          return sendResponse(false, "User doesnt Exists", res);
       }
   let tweet = await Tweet.findOne({_id : tweetId});
   if(!tweet) {
       return sendResponse(false, "No Such tweet Exists" , res);
   }
   tweet.dislikes = tweet.dislikes + 1;
   await tweet.save();
   res.json({
       success : true, 
       message : "Disliked the Tweet"
   })
}));

router.post("/getTweets", error(async ( req, res, next)=>{
    let {email} = req.body;
        let response = await User.findOne({email : email});
        if(!response){
           return sendResponse(false, "User doesnt Exists", res);
        }
        let tweets = await Tweet.find({createdBy: response._id}).sort({date: -1});        
         res.json({
            success: true, 
            message: "All Tweets",
            data: tweets
         })
}))

router.post("/follow", error(async ( req, res, next)=>{
    let {useEmail, followinguser} = req.body;
        let user1 = await User.findOne({email : useEmail});
        let user2 = await User.findOne({email : followinguser});
        if(!user1){
           return sendResponse(false, "User doesnt Exists", res);
        }
        if(!user2){
            return sendResponse(false, "User you are trying to follow doesnt exist", res);
         }  
         
         let followingPresent = user1.following.find((rev) => (rev.followingId.toString() === user2._id.toString())); 
         if(followingPresent){
            return sendResponse(true, "You are already following this user", res);
         }
         user1.following.push({
            followingId : user2._id
         })
         user2.followers.push({
            followersId : user1._id
         })
         await user1.save();
         await user2.save();
         res.json({
            success: true, 
            message: "Following Successfull",
         })
}))

router.post("/unfollow", error(async ( req, res, next)=>{
    let {useEmail, followinguser} = req.body;
        let user1 = await User.findOne({email : useEmail});
        let user2 = await User.findOne({email : followinguser});
        if(!user1){
           return sendResponse(false, "User doesnt Exists", res);
        }
        if(!user2){
            return sendResponse(false, "User you are trying to unfollow doesnt exist", res);
         }  
         
         let followingPresent = user1.following.find((rev) => (rev.followingId.toString() === user2._id.toString())); 
         if(!followingPresent){
            return sendResponse(true, "You cannot unfollow because you are not following user", res);
         }

         let following = user1.following.filter((rev)=>(rev.followingId.toString() === user2._id.toString()));
         let follower =  user2.followers.filter((rev)=>(rev.followersId.toString() === user1._id.toString()));
         user1.following = following;
         user2.followers = follower;
         await user1.save();
         await user2.save();
         res.json({
            success: true, 
            message: "Unfollow Successfull",
         })
}))






module.exports = router;
