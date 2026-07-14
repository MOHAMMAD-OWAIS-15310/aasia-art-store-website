const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdminLoggedIn } = require("../middleware.js");

const Order = require("../models/order.js");
const Listing = require("../models/listing.js");
const Cart = require("../models/cart.js");

//checkour
router.get("/:id/checkout", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Painting not found");
        return res.redirect("/listings");
    }

    res.render("orders/checkout.ejs", {listings:[listing], isCart: false,});
}));

//.......post route
router.post("/:id/place-order", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Painting not found");
        return res.redirect("/listings");
    }
    const{name, phone, address, city, state, pincode }= req.body;
    const order =new Order({
        user: req.user._id,
        paintings: [listing._id],
        name,
        phone,
        address,
        city,
        state,
        pincode,
        totalAmount: listing.price,
    });
    console.log(order);
    await order.save();
    listing.available = "no";
    await listing.save();
    req.flash("success", " order placed successfully");
    res.redirect("/listings");
}));

// My Orders
router.get("/my-orders", isLoggedIn, wrapAsync(async (req, res) => {
    const orders=await Order.find({user: req.user._id,}).populate("paintings");

    res.render("orders/myOrder.ejs",{orders});
}));

module.exports = router;