const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username , email, password}= req.body;
    const newUser = new User({email, username});
    let registeredUser = await User.register(newUser ,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
       req.flash("success","user registered successfully");
    res.redirect("/listings");
    });
   
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
//..........not working with only email passwrd
// router.post("/login", passport.authenticate("local" ,{failureRedirect: '/login' ,failureFlash : true}) ,async(req,res)=>{
//     req.flash("success","you are Logged In");
//     res.redirect("/listings");
// });

router.post("/login",saveRedirectUrl, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email");
      return res.redirect("/login");
    }

    const result = await user.authenticate(password);

    if (!result.user) {
      req.flash("error", "Wrong password");
      return res.redirect("/login");
    }

    req.login(result.user, (err) => {
      if (err) return next(err);

      req.flash("success", "successfully logged in");
      // res.redirect("/listings");
      let redirectUrl=res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });

  } catch (err) {
    next(err);
  }
});

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","you are logged out !!");
    res.redirect("/listings");
  })
})

module.exports = router;

