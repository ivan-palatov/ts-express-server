"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
exports.webRoutes = router;
const authController_1 = require("../controllers/authController");
// All authentication routes
router.use('/', authController_1.authController);
// Other routes
router.get("*", (req, res) => {
    res.render("index", { title: "Main page", info: req.flash("info") });
});
//# sourceMappingURL=web.js.map