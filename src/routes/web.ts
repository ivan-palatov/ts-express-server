import express = require("express");
const router = express.Router();

import { authController } from "../controllers/authController";

// All authentication routes
router.use('/', authController);

// Other routes
router.get("*", (req, res) => {
  res.render("index", { title: "Main page" });
});

export { router as webRoutes };
