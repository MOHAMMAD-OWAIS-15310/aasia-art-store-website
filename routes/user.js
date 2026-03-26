const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const sendOTPEmail = require("../utils/sendEmail");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

// router.post("/signup",wrapAsync(async(req,res)=>{
//     try{
//     let {username , email, password}= req.body;
//     const newUser = new User({email, username});
//     let registeredUser = await User.register(newUser ,password);
//     console.log(registeredUser);
//     req.login(registeredUser,(err)=>{
//       if(err){
//         return next(err);
//       }
//        req.flash("success","user registered successfully");
//     res.redirect("/listings");
//     });
   
//     }
//     catch(err){
//         req.flash("error",err.message);
//         res.redirect("/signup");
//     }
// }));

//.....................email verificatin
router.post("/signup", wrapAsync(async (req, res) => {

  const { username, email, password } = req.body;
  //    email already exists hai ya nhi
  const existingUser = await User.findOne({ email });
  if (existingUser) {
     req.flash("error", "Email already registered");
    return res.redirect("/signup");
  }
  // OTP generate 6 gigit ka
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save signup data temporarily in session
  req.session.signupData = { username, email, password, otp };
  // send email
  await sendOTPEmail(email, otp);
  req.flash("success", "OTP sent to your email");
  res.redirect("/verify-otp");

}));

//..........verify otp 

//get
router.get("/verify-otp", (req, res) => {
  res.render("users/verifyOtp.ejs");
});
//post route
router.post("/verify-otp", wrapAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!req.session.signupData) {
    req.flash("error", "Session expired. Signup again.");
    return res.redirect("/signup");
  }
  if (otp !== req.session.signupData.otp) {
    req.flash("error", "Invalid OTP");
    return res.redirect("/verify-otp");
  }
  // OTP correct : create user now
  const { username, email, password } = req.session.signupData;

  const newUser = new User({ username, email, isVerified: true });
  const registeredUser = await User.register(newUser, password);
  //   session data remove kardiya
  delete req.session.signupData;
  // auto login
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash("success", "successfully signup");
    res.redirect("/listings");
  });

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
      console.log(redirectUrl);
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

