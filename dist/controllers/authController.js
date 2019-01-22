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
// tslint:disable-next-line
const uuidv4 = require("uuid/v4");
const User_1 = require("../models/User");
const nodemailer_1 = require("../nodemailer");
const confirmEmail_1 = require("../notifications/confirmEmail");
const forgotPassword_1 = require("../notifications/forgotPassword");
const passport_1 = require("../passport");
const authValidator_1 = require("../validators/authValidator");
// Show auth form
router.get("/login", passport_1.unauthOnly("/profile/me"), (req, res) => {
    // If errors, parse them
    let errors = req.flash("errors")[0];
    errors = errors ? JSON.parse(errors) : null;
    // If form was send before, parse the params back
    let form = req.flash("form")[0];
    form = form ? JSON.parse(form) : null;
    res.render("login", {
        errors,
        form,
        error: req.flash("error"),
        info: req.flash("info")
    });
});
// Handle auth request
router.post("/login", authValidator_1.authValidator, passport_1.passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("errors", JSON.stringify(errors.mapped()));
        return res.redirect("/register");
    }
    req.flash("form", JSON.stringify({ email: req.body.email }));
    res.render("index", { user: req.user });
});
// Show register form
router.get("/register", passport_1.unauthOnly("/profile/me"), (req, res) => {
    // If errors, parse them
    let errors = req.flash("errors")[0];
    errors = errors ? JSON.parse(errors) : null;
    // If form was send before, parse the params back
    let form = req.flash("form")[0];
    form = form ? JSON.parse(form) : null;
    res.render("register", { errors, form, error: req.flash("error") });
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
        yield nodemailer_1.transporter.sendMail(confirmEmail_1.confirmEmailOptions(user.email, user.activationCode, "http://localhost:3000"));
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
        req.login(user, err => {
            if (err)
                return res.redirect("/login");
        });
        res.redirect("/profile/me");
    }
    catch (errors) {
        req.flash("error", "Can't find a user with that activation code.");
        res.redirect("/login");
    }
}));
// Forgot password form
router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword", { error: req.flash("error") });
});
// Handle forgot password request
// TODO: validate email field
router.post("/forgot-password", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ email: req.body.email, isActive: true });
        if (!user) {
            req.flash("error", "User with that email doesn't exist or hasn't been activated yet.");
            return res.redirect("/forgot-password");
        }
        const uuid = uuidv4();
        user.activationCode = uuid;
        yield nodemailer_1.transporter.sendMail(forgotPassword_1.forgotPasswordOptions(user.email, uuid, "http://localhost:3000"));
        yield user.save();
        req.flash("info", "Check your email to change your password.");
        res.redirect("/login");
    }
    catch (errors) {
        req.flash("error", "Something went wrong");
        res.redirect("/forgot-password");
    }
}));
// Show password reset form
router.get("/reset-password/:code", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.find({ activationCode: req.params.code, isActive: true }, { activationCode: 1 }).limit(1);
        if (!user) {
            req.flash("error", "Invalid password reset code, please try again.");
            res.redirect("/");
        }
        res.render("resetPassword", { error: req.flash("error") });
    }
    catch (errors) {
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
}));
// Handle password reset
// TODO: validate password and password2
router.post("/reset-password", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ activationCode: req.params.code, isActive: true }, { activationCode: 1 });
        if (!user) {
            req.flash("error", "Invalid password reset code, please try again.");
            res.redirect("/");
        }
        user.password = req.body.password;
        user.activationCode = "";
        yield user.save();
        req.flash("info", "You have successfuly changed your password.");
        req.login(user, err => {
            if (err)
                return res.redirect("/login");
        });
        res.redirect("profile/me");
    }
    catch (errors) {
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
}));
// Handle logout request
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
//# sourceMappingURL=authController.js.map