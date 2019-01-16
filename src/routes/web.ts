import express = require("express");
const router = express.Router();

import { authController } from "../controllers/auth";

// All authentication routes
router.use('/auth', authController);

// Other routes
router.get("*", (req, res) => {
  res.render("index", { stuff: "Realy cool paragraph." });
});

export { router as webRoutes };
