module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in as admin");
        return res.redirect("/login");
    }
    if (req.user.email !== "admin@gmail.com") {
        req.flash("error", "Only admin can access this feature");
        return res.redirect("/login");
    }
    next();
}