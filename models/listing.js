const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type : String,
        required : true,
    },
    price: Number,
    size : String , 
    medium : String,
    available :String ,
    image :{
        type : String ,
        default : "https://plus.unsplash.com/premium_photo-1673643405538-de0f82933fcb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // required : true,
    } 
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;