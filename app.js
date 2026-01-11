const express=require("express");
const mongoose = require("mongoose");
const app=express();

const MONGO_URL="mongodb://127.0.0.1:27017/test";

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

app.get("/",(req,res)=>{
    res.send("working");
});
app.listen(3000,()=>{
    console.log("app is listening to port 3000");
});