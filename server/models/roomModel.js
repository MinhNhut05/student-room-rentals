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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure this is required
    },
    images: {
      type: [String], // Array of strings for image URLs
      default: [], // Default to empty array if no images
    },

    // --- PHẦN TIỆN NGHI ---
    amenities: {
      wifi: { type: Boolean, default: false },
      air_conditioner: { type: Boolean, default: false },
      washing_machine: { type: Boolean, default: false },
      fridge: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      private_bathroom: { type: Boolean, default: false },
      kitchen: { type: Boolean, default: false },
      window: { type: Boolean, default: false },
      balcony: { type: Boolean, default: false },
      water_heater: { type: Boolean, default: false },
      tv: { type: Boolean, default: false },
    },

    // --- CÁC TRƯỜNG LIÊN QUAN ĐẾN ĐÁNH GIÁ ---

    // Điểm đánh giá trung bình của phòng, tính từ tất cả các review
    rating: {
      type: Number,
      required: true,
      default: 0, // Mặc định là 0 khi chưa có đánh giá
    },

    // Tổng số lượt đánh giá mà phòng này đã nhận
    numReviews: {
      type: Number,
      required: true,
      default: 0, // Mặc định là 0
    },
  },
  {
    timestamps: true,
  }
);

// Virtual populate để lấy reviews của phòng
roomSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "room",
});

// Đảm bảo virtual fields được bao gồm khi convert sang JSON
roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Room", roomSchema);
