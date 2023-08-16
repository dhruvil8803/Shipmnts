const validator = require('validator');
const mongoose = require('mongoose');
const validateEmail = (email)=>{
    return validator.isEmail(email);
}
const validateName = (name)=>{
  return validator.isAlpha(name);
}
const schema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
        minLength: [2, "Name must have minimum 2 characters"],
        maxLength: [20, "Name should be shorter than 20 characters"],
        trim: true,
        validate: [validateName, "Enter valid name"]
    },
    email:{
        type: String,
        required : true,
       validate: [validateEmail, "Enter valid email"],
       unique: true
    },
    password:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    followers: [
        {
            followersId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            }
        }
    ],
    following : [
        {
            followingId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            }
        }
    ], 
    tweets : [
        {
            tweetId:{
                type: mongoose.Schema.ObjectId,
                ref: "Tweet",
                required : true
            }
        }
    ]
})

module.exports = new mongoose.model("User", schema);