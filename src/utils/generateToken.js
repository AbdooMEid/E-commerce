const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

module.exports = generateToken;
