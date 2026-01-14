const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedPaintingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }
});

const SavedPainting =mongoose.model("SavedPainting", savedPaintingSchema);
module.exports = SavedPainting;