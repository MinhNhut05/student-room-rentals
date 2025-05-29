const mongoose = require("mongoose");
const Room = require("./models/roomModel");

// Kết nối MongoDB và chạy seed data
mongoose
  .connect(
    "mongodb+srv://leminhoocaolanh:9cne3qKPgBydysPN@cluster0.8wcp2wy.mongodb.net/roomrental?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("✅ Kết nối MongoDB thành công");

    console.log("✅ Seed hoàn thành!");
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Lỗi:", err.message);
  });
