const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const SavedPainting = require("../models/savedPaintings.js");

//save route
router.post("/:id/save",wrapAsync(async(req,res)=>{
    const {id} =req.params;
    const alreadySaved = await SavedPainting.findOne({listing : id});
    if( !alreadySaved){
      const savedPainting = new SavedPainting({listing : id});
         await savedPainting.save();
    }
    res.redirect("/listings");
}));

//save index
router.get("/saved", wrapAsync(async (req, res) => {
    const saved = await SavedPainting.find({}).populate("listing");
    res.render("listings/saved.ejs", { saved });
}));

// unsave
router.post("/:id/unsave", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await SavedPainting.findOneAndDelete({ listing: id });
    res.redirect("/listings/saved");
}));

module.exports = router;