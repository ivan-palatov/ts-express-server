import express = require("express");
const router = express.Router();

router.get("*", (req, res) => {
  res.json({ test: "This is api in work." });
});

export { router as apiRoutes };
