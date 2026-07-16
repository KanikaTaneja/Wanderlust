const mongoose = require("mongoose");
const review = require("./review");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
    title:{
        type:"String",
        required:true,
    },
    description:"String",
    image:{
        url: {
            type: String,
            default: "https://a0.muscache.com/im/pictures/miso/Hosting-774520799663098636/original/9b845c8e-9cc8-47fc-b27f-5cb5f8120294.jpeg?im_w=720",
        },
        filename: {
            type: String,
            default: "listingimage",
        },
    },
    price:"Number",
    location:"String",
    country:"String",
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review", //router/review.js
    }],
    owner:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"user", // router/user.js
    },
    geometry:{
         type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
}
});
// mongoose middleware
listingSchema.post("findOneAndDelete" ,async(listing) =>{
    if(listing){
     await review.deleteMany({_id :{$in : listing.reviews}});
    }
});

const listing = mongoose.model("listing" , listingSchema);
module.exports = listing;