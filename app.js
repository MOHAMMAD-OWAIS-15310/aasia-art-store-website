const express=require("express");
const mongoose = require("mongoose");
const app=express();
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const SavedPainting = require("./models/savedPaintings.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/artStore";

main()
    .then(()=>{
    console.log("connected to db");
    })
    .catch(err =>{
    console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("working");
});

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body.listing);
    // console.log(result);
    if(error){
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body.listing);
    // console.log(result);
    if(error){
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


//saved painting routes
//save route
app.post("/listings/:id/save",wrapAsync(async(req,res)=>{
    const {id} =req.params;
    const alreadySaved = await SavedPainting.findOne({listing : id});
    if( !alreadySaved){
      const savedPainting = new SavedPainting({listing : id});
         await savedPainting.save();
    }
    res.redirect("/listings");
}));

//save index
app.get("/listings/saved", wrapAsync(async (req, res) => {
    const saved = await SavedPainting.find({}).populate("listing");
    res.render("listings/saved.ejs", { saved });
}));

// unsave
app.post("/listings/:id/unsave", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await SavedPainting.findOneAndDelete({ listing: id });
    res.redirect("/listings/saved");
}));

//paintings
//index
app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));

//new
app.get("/listings/new",((req,res)=>{
    res.render("listings/new.ejs");
}));

//about
app.get("/listings/about", ((req,res)=>{
    res.render("listings/about.ejs");
}));

//myCart
app.get("/listings/cart", ((req,res)=>{
    res.render("listings/cart.ejs");
}));

//buyNow
app.get("/listings/:id/payment", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/payment.ejs",{listing});
}));


//show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create
app.post("/listings",validateListing, wrapAsync(async(req,res)=>{
    // let listing =req.body.listing;
    // console.log(req.body);
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    res.redirect("/listings");
}));

//edit
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update
app.put("/listings/:id" ,validateListing, wrapAsync( async(req,res) =>{
    // if( !req.body.listing){
    //     throw new ExpressError(400 , "send valid data");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   //console.log(deletedListing);
   res.redirect("/listings");
}));


//reviews
//post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id , {$pull :{reviews : reviewId}} );
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// app.get("/testlisting", async (req,res)=>{
//     let sampleListing= new Listing({
//         title: "trees",
//         price: 100,
//         size : "medium" , 
//         medium :"guache" ,
//         available :"yes" ,
//         image :"C:\Users\Ahmed Taqiuddin\Pictures\Aasia's collection (p)\IMG_20220615_150541_197.jpg" ,
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// })



app.use((err,req,res,next)=>{
    let {statusCode=500 , message = "something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message});
    // res.send("something went wrong");
})

app.listen(3000,()=>{
    console.log("app is listening to port 3000");
});