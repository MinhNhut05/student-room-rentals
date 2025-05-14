const mongoose = require("mongoose");
const Room = require("./models/roomModel");

mongoose
  .connect(
    "mongodb+srv://leminhoocaolanh:9cne3qKPgBydysPN@cluster0.8wcp2wy.mongodb.net/roomrental?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    const rooms = await Room.create([
      {
        title: "Phòng Gò Vấp",
        description: "Phòng đẹp, có điều hòa, gần trung tâm",
        price: 2500000,
        location: "TP.HCM",
      },
    ]);

    console.log("✅ Seed thành công!");
    rooms.forEach((room) => {
      console.log(`🆔 ID: ${room._id.toString()}`);
    });

    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối:", err);
  });
