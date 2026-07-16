const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    content: String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"user"

    }
});

const review = mongoose.model("review" , reviewSchema);
module.exports=review;