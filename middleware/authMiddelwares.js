const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(401).json({
        status: 401,
        message: "Token not found.",
      });

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode.user_id)
      return res.status(401).json({
        status: 401,
        message: "Token not valid.",
      });

    req.user_id = decode.user_id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 401,
      message: `Error Verify Token: ${error.message}`,
    });
  }
};
