import express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import passwordGenerator = require("password-generator");
// tslint:disable-next-line
import uuidv4 = require("uuid/v4");

import { User } from "../models/User";
import { transporter } from "../nodemailer";
import { confirmEmailOptions } from "../notifications/confirmEmail";
import { forgotPasswordOptions } from "../notifications/forgotPassword";
import { passport, unauthOnly } from "../passport";
import { authValidator, registerValidator } from "../validators/authValidator";

// Show auth form
router.get("/auth", unauthOnly("/profile/me"), (req, res) => {
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
router.post(
  "/auth",
  authValidator,
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/auth" }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errors", JSON.stringify(errors.mapped()));
      return res.redirect("/register");
    }
    req.flash("form", JSON.stringify({ email: req.body.email }));
    res.render("index", { user: req.user, title: "Main page" });
  }
);

// Show register form
router.get("/register", unauthOnly("/profile/me"), (req, res) => {
  // If errors, parse them
  let errors = req.flash("errors")[0];
  errors = errors ? JSON.parse(errors) : null;
  // If form was send before, parse the params back
  let form = req.flash("form")[0];
  form = form ? JSON.parse(form) : null;
  res.render("register", { errors, form, error: req.flash("error"), title: "Register" });
});

// Handle register request
router.post(
  "/register",
  registerValidator,
  unauthOnly("/profile/me"),
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("errors", JSON.stringify(errors.mapped()));
        return res.redirect("/register");
      }
      req.flash("form", JSON.stringify({ email: req.body.email, name: req.body.name }));
      // If validation passed, proceed to register user
      const { email, name, password } = req.body;
      const user = await new User({ email, name, password }).save();
      // Send activation email
      await transporter.sendMail(
        confirmEmailOptions(user.email, user.activationCode, "http://localhost:3000")
      );
      // Show info message and redirect to main page
      req.flash("info", "You have successfuly registered, please confirm your email to continue.");
      res.redirect("/");
    } catch (errors) {
      // TODO: if user email/name already exists?
      // see what errors and in what format mongoose passes
      console.log(errors);
      req.flash("error", "Something went wrong, please try again later.");
      res.redirect("back");
    }
  }
);

// Activate user via activation code
router.get("/activate/:code", async (req, res) => {
  try {
    const user = await User.findOne({ activationCode: req.params.code });
    user.activationCode = "";
    user.isActive = true;
    user.save();
    req.flash("info", "Successfuly activated!");
    req.login(user, err => {
      if (err) return res.redirect("/auth");
    });
    res.redirect("/profile/me");
  } catch (errors) {
    req.flash("error", "Can't find a user with that activation code.");
    res.redirect("/auth");
  }
});

// Forgot password form
router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword", { title: "Forgot password", error: req.flash("error") });
});

// Handle forgot password request
// TODO: validate email field
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, isActive: true });
    if (!user) {
      req.flash("error", "User with that email doesn't exist or hasn't been activated yet.");
      return res.redirect("/forgot-password");
    }
    const uuid = uuidv4();
    user.activationCode = uuid;
    await transporter.sendMail(forgotPasswordOptions(user.email, uuid, "http://localhost:3000"));
    await user.save();
    req.flash("info", "Check your email to change your password.");
    res.redirect("/login");
  } catch (errors) {
    req.flash("error", "Something went wrong");
    res.redirect("/forgot-password");
  }
});

// Show password reset form
router.get("/reset-password/:code", async (req, res) => {
  try {
    const user = await User.find(
      { activationCode: req.params.code, isActive: true },
      { activationCode: 1 }
    ).limit(1);
    if (!user) {
      req.flash("error", "Invalid password reset code, please try again.");
      res.redirect("/");
    }
    res.render("resetPassword", { title: "Reset password", error: req.flash("error") });
  } catch (errors) {
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
});

// Handle password reset
// TODO: validate password and password2
router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne(
      { activationCode: req.params.code, isActive: true },
      { activationCode: 1 }
    );
    if (!user) {
      req.flash("error", "Invalid password reset code, please try again.");
      res.redirect("/");
    }
    user.password = req.body.password;
    user.activationCode = "";
    await user.save();
    req.flash("info", "You have successfuly changed your password.");
    req.login(user, err => {
      if (err) return res.redirect("/auth");
    });
    res.redirect("profile/me");
  } catch (errors) {
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
});

// Handle logout request
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export { router as authController };
