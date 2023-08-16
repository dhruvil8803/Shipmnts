const mongoose = require('mongoose');
const schema = new mongoose.Schema({
   desc : {
    type: String,
    required: [true, "Descreption of product is required"],
    trim: true
   },
   likes:{
    type: Number,
    default: 0
   },
   dislikes:{
    type: Number,
    default: 0
   },
   createdBy:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
   },
   comments:[
    {   
         by:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
       },
        name:{
            type: String,
            required: true,
            trim: true
        },
        desc:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            default: Date.now 
        }
    }
   ],
   date: {
    type: Date,
    default: Date.now
   }
});

module.exports = new mongoose.model("Tweet", schema);