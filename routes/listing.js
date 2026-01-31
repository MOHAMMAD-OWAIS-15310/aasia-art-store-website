const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const SavedPainting = require("../models/savedPaintings.js");
const mongoose = require("mongoose");


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//paintings
//index
router.get("/", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));

//new
router.get("/new",((req,res)=>{
    res.render("listings/new.ejs");
}));

//about
router.get("/about", ((req,res)=>{
    res.render("listings/about.ejs");
}));

//myCart
router.get("/cart", ((req,res)=>{
    res.render("listings/cart.ejs");
}));

//buyNow
router.get("/:id/payment", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/payment.ejs",{listing});
}));


//show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create
router.post("/",validateListing, wrapAsync(async(req,res)=>{
    // let listing =req.body.listing;
    // console.log(req.body);
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    res.redirect("/listings");
}));

//edit
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update
router.put("/:id" ,validateListing, wrapAsync( async(req,res) =>{
    // if( !req.body.listing){
    //     throw new ExpressError(400 , "send valid data");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete
router.delete("/:id", wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
   //delete from savedpainting db also
   let issaved=await SavedPainting.findOneAndDelete({ listing: id });
    //console.log(issaved);
   res.redirect("/listings");
}));

module.exports = router;