const Token = require("../helper/Token");
const bcrypt = require("bcrypt");
const userModels = require("../models/userModel");

//handle login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        status: 400,
        message: "Bad Request, require is email, password",
      });

    const check_email = await userModels.findOne({ email: email });

    if (!check_email)
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });

    const verify_password = await bcrypt.compare(
      password,
      check_email.password
    );

    if (!verify_password)
      return res.status(401).json({
        status: 401,
        message: "Password is incorrect",
      });

    const token = new Token(check_email._id, req.headers["user-agent"], req.ip);
    const generateToken = await token.generateToken();

    if (generateToken?.status === false)
      return res.status(500).json({
        status: 500,
        message: generateToken.message,
      });

    return res
      .status(200)
      .json({ status: 200, message: "success", ...generateToken });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Login: ${error.message}`,
    });
  }
};

//handle refresh token
exports.refreshToken = async (req, res) => {
  try {
    const getToken = req.headers["Authorization"];

    const token = new Token("", req.headers["user-agent"], req.ip);

    const refreshToken = await token.refreshToken(getToken);

    if (refreshToken?.status === false)
      return res.status(500).json({
        status: 500,
        message: refreshToken.message,
      });

    return res
      .status(200)
      .json({ status: 200, message: "success", ...refreshToken });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error Refresh Token: ${error.message}`,
    });
  }
};
