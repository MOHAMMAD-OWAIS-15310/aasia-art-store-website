const express=require("express");
const mongoose = require("mongoose");
const app=express();
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const SavedPainting = require("./models/savedPaintings.js");

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
//save route
app.post("/listings/:id/save",async(req,res)=>{
    const {id} =req.params;
    const alreadySaved = await SavedPainting.findOne({listing : id});
    if( !alreadySaved){
      const savedPainting = new SavedPainting({listing : id});
         await savedPainting.save();
    }
    res.redirect("/listings");
});

//save index
app.get("/listings/saved", async (req, res) => {
    const saved = await SavedPainting.find({}).populate("listing");
    res.render("listings/saved.ejs", { saved });
});

// unsave
app.post("/listings/:id/unsave", async (req, res) => {
    const { id } = req.params;
    await SavedPainting.findOneAndDelete({ listing: id });
    res.redirect("/listings/saved");
});

//paintings
//index
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
});

//new
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//about
app.get("/listings/about",(req,res)=>{
    res.render("listings/about.ejs");
});

//myCart
app.get("/listings/cart",(req,res)=>{
    res.render("listings/cart.ejs");
});

//buyNow
app.get("/listings/:id/payment",async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/payment.ejs",{listing});
});


//show rroute
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//create
app.post("/listings",async(req,res)=>{
    // let listing =req.body.listing;
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    res.redirect("/listings");
})

//edit
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update
app.put("/listings/:id" , async(req,res) =>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete
app.delete("/listings/:id",async(req,res)=>{
   let {id}=req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   //console.log(deletedListing);
   res.redirect("/listings");
})





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

app.listen(3000,()=>{
    console.log("app is listening to port 3000");
});