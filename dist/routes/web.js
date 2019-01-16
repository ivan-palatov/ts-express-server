"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
exports.webRoutes = router;
const auth_1 = require("../controllers/auth");
// All authentication routes
router.use('/auth', auth_1.authController);
// Other routes
router.get("*", (req, res) => {
    res.render("index", { stuff: "Realy cool paragraph." });
});
//# sourceMappingURL=web.js.map