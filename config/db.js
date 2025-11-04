const mongoose = require("mongoose");

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1); // หยุดการทำงานทันทีเมื่อ database ไม่สามารถเชื่อมต่อได้
  }
};

module.exports = connectionDB;
