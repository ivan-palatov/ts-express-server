"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
exports.authController = router;
const check_1 = require("express-validator/check");
const User_1 = require("../models/User");
const nodemailer_1 = require("../nodemailer");
const confirmEmail_1 = require("../notifications/confirmEmail");
const passport_1 = require("../passport");
const authValidator_1 = require("../validators/authValidator");
// Show auth form
router.get("/auth", passport_1.unauthOnly("/profile/me"), (req, res) => {
    // If errors, parse them
    let errors = req.flash("errors")[0];
    errors = errors ? JSON.parse(errors) : null;
    // If form was send before, parse the params back
    let form = req.flash("form")[0];
    form = form ? JSON.parse(form) : null;
    res.render("auth", {
        errors,
        form,
        title: "Login",
        error: req.flash("error"),
        info: req.flash("info")
    });
});
// Handle auth request
router.post("/auth", authValidator_1.authValidator, passport_1.passport.authenticate("local", { failureFlash: true, failureRedirect: "/auth" }), (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", JSON.stringify(errors.mapped()));
        return res.redirect("/register");
    }
    req.flash("form", JSON.stringify({ email: req.body.email }));
    res.render("index", { user: req.user, title: "Main page" });
});
// Show register form
router.get("/register", passport_1.unauthOnly("/profile/me"), (req, res) => {
    // If errors, parse them
    let errors = req.flash("errors")[0];
    errors = errors ? JSON.parse(errors) : null;
    // If form was send before, parse the params back
    let form = req.flash("form")[0];
    form = form ? JSON.parse(form) : null;
    res.render("register", { errors, form, error: req.flash("error"), title: "Register" });
});
// Handle register request
router.post("/register", authValidator_1.registerValidator, passport_1.unauthOnly("/profile/me"), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = check_1.validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", JSON.stringify(errors.mapped()));
            return res.redirect("/register");
        }
        req.flash("form", JSON.stringify({ email: req.body.email, name: req.body.name }));
        // If validation passed, proceed to register user
        const { email, name, password } = req.body;
        const user = yield new User_1.User({ email, name, password }).save();
        // Send activation email
        yield nodemailer_1.transporter.sendMail(confirmEmail_1.mailOptions(user.email, user.activationCode, "http://localhost:3000"));
        // Show info message and redirect to main page
        req.flash("info", "You have successfuly registered, please confirm your email to continue.");
        res.redirect("/");
    }
    catch (errors) {
        // TODO: if user email/name already exists?
        // see what errors and in what format mongoose passes
        console.log(errors);
        req.flash("error", "Something went wrong, please try again later.");
        res.redirect("back");
    }
}));
// Activate user via activation code
router.get("/activate/:code", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ activationCode: req.params.code });
        user.activationCode = "";
        user.isActive = true;
        user.save();
        req.flash("info", "Successfuly activated!");
        res.redirect("/auth");
    }
    catch (errors) {
        req.flash("error", "Can't find a user with that activation code.");
        res.redirect("/auth");
    }
}));
//# sourceMappingURL=authController.js.map