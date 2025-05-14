const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected`);
    console.log("🔌 Database Status:", conn.connection.readyState); // 1 = Connected
    console.log("📊 Database Name:", conn.connection.name); // Check DB name
    console.log("🌐 Host:", conn.connection.host); // Verify MongoDB host
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
