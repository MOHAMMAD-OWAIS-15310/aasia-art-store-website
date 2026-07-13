const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const  orderSchema =new Schema(
        {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

          paintings:[
            {
                type : Schema.Types.ObjectId,
                ref: "Listing",

                required: true,
            },
        ],



         name:{
            type:String, 
            
            required: true,
        },
        phone:  {
            type:String,
            required: true,
        },

        address :{
            type: String,
            required:true,
        },

            city:{
                type : String,
                required: true,
            },

        state:{
            type: String,
            required: true,
        },

        pincode: {
            type : String,
        required: true,
        },

        totalAmount :  {
            type :Number,
            required :true,
        },

        paymentMethod :{
            type: String,
            enum: ["COD"],
            default: "COD",
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Packed",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);