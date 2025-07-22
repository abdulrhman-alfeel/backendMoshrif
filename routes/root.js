const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res,next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline';"
  );
  next();
  res.sendFile(path.join(__dirname, "../views", "index.html"));
});

module.exports = router;
