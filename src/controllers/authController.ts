import express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
// tslint:disable-next-line
import uuidv4 = require("uuid/v4");

import { User } from "../models/User";
import { transporter } from "../nodemailer";
import { confirmEmailOptions } from "../notifications/confirmEmail";
import { forgotPasswordOptions } from "../notifications/forgotPassword";
import { passport, unauthOnly } from "../passport";
import {
  authValidator,
  emailValidator,
  passwordsValidator,
  registerValidator
} from "../validators/authValidator";

// Show auth form
router.get("/login", unauthOnly("/profile/me"), (req, res) => {
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
router.post(
  "/login",
  authValidator,
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errors", JSON.stringify(errors.mapped()));
      req.flash("form", JSON.stringify({ email: req.body.email }));
      return res.redirect("/register");
    }
    res.render("index", { user: req.user });
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
  res.render("register", { errors, form, error: req.flash("error") });
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
        req.flash("form", JSON.stringify({ email: req.body.email, name: req.body.name }));
        return res.redirect("/register");
      }
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
      if (err) return res.redirect("/login");
    });
    res.redirect("/profile/me");
  } catch (errors) {
    req.flash("error", "Can't find a user with that activation code.");
    res.redirect("/login");
  }
});

// Forgot password form
router.get("/forgot-password", unauthOnly("/profile/me"), (req, res) => {
  // If errors, parse them
  let errors = req.flash("errors")[0];
  errors = errors ? JSON.parse(errors) : null;
  res.render("forgotPassword", { errors, error: req.flash("error") });
});

// Handle forgot password request
router.post(
  "/forgot-password",
  unauthOnly("/profile/me"),
  emailValidator,
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("errors", JSON.stringify(errors.mapped()));
        return res.redirect("/forgot-password");
      }
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
  }
);

// Show password reset form
router.get("/reset-password/:code", unauthOnly("profile/me"), async (req, res) => {
  try {
    const user = await User.findOne(
      { activationCode: req.params.code, isActive: true },
      { activationCode: 1 }
    );
    if (!user) {
      req.flash("error", "Invalid password reset code.");
      return res.redirect("/");
    }
    // If errors, parse them
    let errors = req.flash("errors")[0];
    errors = errors ? JSON.parse(errors) : null;
    res.render("resetPassword", { errors, error: req.flash("error") });
  } catch (errors) {
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
});

// Handle password reset
router.post(
  "/reset-password/:code",
  unauthOnly("/profile/me"),
  passwordsValidator,
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("errors", JSON.stringify(errors.mapped()));
        return res.redirect("back");
      }
      const user = await User.findOne(
        { activationCode: req.params.code, isActive: true },
        { activationCode: 1 }
      );
      if (!user) {
        req.flash("error", "Invalid password reset code, please try again.");
        return res.redirect("/");
      }
      user.password = req.body.password;
      user.activationCode = "";
      await user.save();
      req.flash("info", "You have successfuly changed your password.");
      req.login(user, err => {
        if (err) return res.redirect("/login");
      });
      res.redirect("profile/me");
    } catch (errors) {
      req.flash("error", "Something went wrong");
      res.redirect("/");
    }
  }
);

// Handle logout request
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export { router as authController };
