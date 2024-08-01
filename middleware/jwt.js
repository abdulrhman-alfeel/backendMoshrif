const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const JWT_KEY =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYWN0aW9uIjoi2LPZhNin2K";

  const accessToken = sign(user, process.env.JWT_KEY || JWT_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    req.session.user = decoded;

    next();
  });
};

module.exports = { createTokens, verifyJWT };
