const refreshTokenModel = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class Token {
  constructor(user_id, user_agent, ip_address) {
    this.user_id = user_id;
    this.user_agent = user_agent;
    this.ip_address = ip_address;
  }

  async generateToken() {
    try {
      // create access token
      const access_token = await jwt.sign(
        {
          user_id: this.user_id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      // create refresh token
      const refresh_token = await jwt.sign(
        {
          user_id: this.user_id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      const decodedToken = jwt.decode(refresh_token);
      const expirationTimestamp = decodedToken.exp; // This is a Unix timestamp in seconds
      // Convert the Unix timestamp to a Date object
      const expirationDate = new Date(expirationTimestamp * 1000); // Multiply by

      //hash refresh token
      const refresh_token_hash = await bcrypt.hash(refresh_token, 10);

      //insert refresh token to database
      const create_refresh_token = await refreshTokenModel.create({
        user_id: this.user_id,
        token_hash: refresh_token_hash,
        expired_at: expirationDate,
        user_agent: this.user_agent,
        ip_address: this.ip_address,
        last_user_at: new Date(),
      });

      if (!create_refresh_token)
        return { status: false, message: "Error to create refresh token" };

      return {
        access_token: access_token,
        refresh_token: refresh_token,
      };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }

  async refreshToken(refresh_token) {
    try {
      //hash refresh token
      const refresh_token_hash = await bcrypt.hash(refresh_token, 10);

      const findOne = await refreshTokenModel.findOne({
        token_hash: refresh_token_hash,
      });

      if (!findOne)
        return {
          status: false,
          message: "refresh token not found",
        };

      this.user_id = findOne._id;

      await refreshTokenModel.findByIdAndDelete(findOne._id);

      //get method generateToken
      const generateToken = await this.generateToken();
      return generateToken;
    } catch (error) {
      return { status: false, message: error.message };
    }
  }
}

module.exports = Token;
