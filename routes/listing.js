const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const SavedPainting = require("../models/savedPaintings.js");
const mongoose = require("mongoose");
const {isLoggedIn}= require("../middleware.js");
const {isAdminLoggedIn}= require("../middleware.js");

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
router.get("/new",isAdminLoggedIn,((req,res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in as admin");
    //     return res.redirect("/login");
    // }
    // if (req.user.email !== "admin@gmail.com") {
    //     req.flash("error", "Only admin can add new listing");
    //     return res.redirect("/login");
    // }
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
    // const listing= await Listing.findById(id).populate("reviews").populate("author");
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path :"author",},});
    res.render("listings/show.ejs",{listing});
}));

//create
router.post("/",isAdminLoggedIn,validateListing, wrapAsync(async(req,res)=>{
    // let listing =req.body.listing;
    // console.log(req.body);
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    req.flash("success","new painting created !");
    res.redirect("/listings");
}));

//edit
router.get("/:id/edit",isAdminLoggedIn, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update
router.put("/:id" ,isAdminLoggedIn, validateListing, wrapAsync( async(req,res) =>{
    // if( !req.body.listing){
    //     throw new ExpressError(400 , "send valid data");
    // }
    let {id}=req.params;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (req.user.email == "aasiataqi1811@gmail.com") {
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success"," painting updated !");
    }
    res.redirect(`/listings/${id}`);
}));

//delete
router.delete("/:id",isAdminLoggedIn, wrapAsync(async(req,res)=>{
   let {id}=req.params;
   if (req.user.email == "aasiataqi1811@gmail.com") {
    let deletedListing = await Listing.findByIdAndDelete(id);
        //console.log(deletedListing);
        //delete frm savedpainting db also
        let issaved=await SavedPainting.findOneAndDelete({ listing: id });
        //console.log(issaved);
        req.flash("success"," painting deleted !");
   }
   res.redirect("/listings");
}));

module.exports = router;