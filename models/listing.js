const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type : String,
        required : true,
    },
    price: Number,
    size : String , 
    medium : String,
    available :{
        type : String,
        enum: ['yes', 'no'],
        required: true
    },
    image :{
        url: String,
        filename : String,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;