const Review = require("./models/review")

module.exports.isAdminLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in as admin");
        return res.redirect("/login");
    }
    // if (req.user.email !== "admin@gmail.com") {
    if (req.user.email !== "aasiataqi1811@gmail.com") {
        req.flash("error", "Only admin can access this feature");
        return res.redirect("/login");
    }
    next();
}
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    // // if (req.user.email !== "admin@gmail.com") {
    // if (req.user.email !== "aasiataqi1811@gmail.com") {
    //     req.flash("error", "Only admin can access this feature");
    //     return res.redirect("/login");
    // }
    next();
}
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(req.user.email === "aasiataqi1811@gmail.com"){
        return next();
    }
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}