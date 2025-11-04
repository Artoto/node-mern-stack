const mongoose = require("mongoose");
const refreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User ID",
    required: true,
  },
  token_hash: { type: String, ref: "refresh token hash.", required: true },
  expired_at: { type: Date, ref: "expired to date.", required: true },
  user_agent: {
    type: String,
    ref: "ข้อมุล Browser/Client ที่ใช้.",
    required: true,
  },
  ip_address: { type: String, ref: "IP Address ของ client", required: true },
  created_at: { type: Date, ref: "created to date.", default: Date.now() },
  last_user_at: { type: Date, ref: "last used to date.", required: true },
});

module.exports = mongoose.model("refresh_token", refreshTokenSchema);
