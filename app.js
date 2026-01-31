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

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const savedPaintings = require("./routes/savedPainting.js");


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





//saved painting routes
app.use("/listings",savedPaintings);


//paintings
app.use("/listings",listings);

//reviews
app.use("/listings/:id/reviews",reviews);

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