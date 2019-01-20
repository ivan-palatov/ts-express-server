"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
exports.authController = router;
const check_1 = require("express-validator/check");
const passport_1 = require("../passport");
const authValidator_1 = require("../validators/authValidator");
// Show auth form
router.get("/auth", passport_1.unauthOnly("/profile/me"), (req, res) => {
    res.render("auth", { title: "Login", error: req.flash("error") });
});
// Handle auth request
router.post("/auth", passport_1.passport.authenticate("local", { failureFlash: true, failureRedirect: "/auth" }), (req, res) => {
    res.render("index", { user: req.user });
});
// Show register form
router.get("/register", passport_1.unauthOnly("/profile/me"), (req, res) => {
    let errors = req.flash("errors")[0];
    errors = errors ? JSON.parse(errors) : null;
    res.render("register", { errors, title: "Register" });
});
// Handle register request
router.post("/register", authValidator_1.registerValidator, passport_1.unauthOnly("/profile/me"), (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", JSON.stringify(errors.mapped()));
        return res.redirect("/register");
    }
    // TODO: password confirmation
    // const { email, name, password } = req.body;
    // const user = new User({ email, name, password });
    // user
    //   .save()
    //   .then(newUser => {
    //     req.login(newUser, err => {
    //       if (err) return res.redirect(500, "/");
    //       res.redirect("profile/me");
    //     });
    //   })
    //   .catch(err => {
    //     req.flash("error", err);
    //     res.redirect("back");
    //   });
});
//# sourceMappingURL=authController.js.map