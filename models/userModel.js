const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, default: "user", ref: "ตำแหน่งผู้ใช้" },
  created_at: { type: Date, default: Date.now(), ref: "create to date." },
  updated_at: { type: Date, default: Date.now(), ref: "update to date." },
});

module.exports = mongoose.model("User", userSchema);
