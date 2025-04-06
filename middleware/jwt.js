const { sign, verify } = require("jsonwebtoken");


const createTokens = (user) => {
  const accessToken = sign(user, process.env.JWT_KEY , {
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
  if (token === process.env.ADMIN) {
    next();
  } else {  

    verify(token, process.env.JWT_KEY , (error, decoded) => {
      if (error) return res.status(403).json({ message: "Forbidden" });
      // console.log(error);

      req.session.user = decoded;

      next();
    });
  }
};

module.exports = { createTokens, verifyJWT };
