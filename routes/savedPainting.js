const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const SavedPainting = require("../models/savedPaintings.js");
const { isLoggedIn } = require("../middleware.js");

//save route
router.post("/:id/save",wrapAsync(async(req,res)=>{
    if(req.user){
        const {id} =req.params;
        const alreadySaved = await SavedPainting.findOne({listing : id,user: req.user._id});
        if( !alreadySaved){
        const savedPainting = new SavedPainting({listing : id,user: req.user._id});
            await savedPainting.save();
        }
        req.flash("success","painting saved !");
    }
    if(!req.user){
        req.flash("error","you must be logged in to save painting !!");
    }
    res.redirect("/listings");
}));

//save index
router.get("/saved",isLoggedIn, wrapAsync(async (req, res) => {
    const saved = await SavedPainting.find({user: req.user._id}).populate("listing");
    res.render("listings/saved.ejs", { saved });
}));

// unsave
router.post("/:id/unsave",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await SavedPainting.findOneAndDelete({ listing: id, user: req.user._id });
    req.flash("error","painting removed !");
    res.redirect("/listings/saved");
}));

module.exports = router;