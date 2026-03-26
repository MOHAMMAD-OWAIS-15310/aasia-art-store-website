// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const passportLocalMongoose = require("passport-local-mongoose").default;

// const userSchema = new Schema({
//     email : {
//         type : String,
//         required : true,
//     }
// })
// userSchema.plugin(passportLocalMongoose);
// // userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
// module.exports = mongoose.model("User", userSchema);


//....................email verification
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },
    isVerified : {
        type : Boolean,
        default : false
    },

    otp : String,
    otpExpires : Date,
})
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(passportLocalMongoose, {usernameField: "email"});
module.exports = mongoose.model("User", userSchema);