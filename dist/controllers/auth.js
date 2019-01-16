"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
exports.authController = router;
router.get("/", (req, res) => {
    res.render("auth", { text: "List of users" });
});
router.get("/create", (req, res) => {
    res.render("auth", { text: "Make user here" });
});
router.post("/", (req, res) => {
    res.render("auth", { text: "Your user is being created" });
});
router.get("/:id", (req, res) => {
    res.render("auth", { text: `User ${req.params.id} is being shown.` });
});
router.get("/:id/edit", (req, res) => {
    res.render("auth", { text: `Edit page for ${req.params.id} user.` });
});
router.patch("/:id", (req, res) => {
    res.render("auth", { text: `User ${req.params.id} is being updated.` });
});
router.delete("/:id", (req, res) => {
    res.render("auth", { text: `You deleted ${req.params.id} user.` });
});
//# sourceMappingURL=auth.js.map