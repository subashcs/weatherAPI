const UsersDAO = require("../dao/usersDAO");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    } catch (err) {
      res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    }
    console.log("authenticating", decoded);
    const currentUser = await UsersDAO.getUserByEmail(decoded.data.email);
    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
  }
};
