const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Cart = require("../models/cart.js");
const { isLoggedIn } = require("../middleware.js");

// Add to Cart
router.post("/:id/cart", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;

    const alreadyInCart = await Cart.findOne({
        listing: id,
        user: req.user._id,
    });

    if (!alreadyInCart) {
        const cart = new Cart({
            listing: id,
            user: req.user._id,
        });

        await cart.save();
        req.flash("success", "Painting added to cart");
    } else {
        req.flash("error", "Painting is already in your cart");
    }

    // res.redirect("/listings");
    res.redirect(`/listings/${id}`);
}));

// get
router.get("/cart", isLoggedIn, wrapAsync(async (req, res) => {
    const cart = await Cart.find({
        user: req.user._id,
    }).populate("listing");

    res.render("listings/cart.ejs", { cart });
}));



module.exports = router;