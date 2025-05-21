const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: String,
    location: { type: String }, // Not required anymore
    area: Number,
    bedrooms: Number,
    bathrooms: Number,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
