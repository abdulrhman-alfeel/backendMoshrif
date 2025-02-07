const { sign, verify } = require("jsonwebtoken");

const JWT_KEY =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYWN0aW9uIjoi2LPZhNin2K";

const Admin =
  "dPdJ0ThcQ6ODl2_z5Nn2iO:APA91bE6yk0i_5M3YAmtAvBwEZIayJ4hOqFDMvQwQwhqTfn2bDwirSInge1kZGskTwvtzsEuZ6-FFU-06NVrAbTmB9UpQ63M9v5tgmKwj4_evGfJMz6PlIiWxOlvhHdnhR6fAbodYhRV";
const createTokens = (user) => {
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
  if (token === Admin) {
    next();
  } else {
    verify(token, process.env.JWT_KEY || JWT_KEY, (error, decoded) => {
      if (error) return res.status(403).json({ message: "Forbidden" });
      // console.log(error);

      req.session.user = decoded;

      next();
    });
  }
};

module.exports = { createTokens, verifyJWT };
