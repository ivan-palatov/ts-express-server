import express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { validationResult } from "express-validator/check";

import { User } from "../models/User";
import { transporter } from "../nodemailer";
import { mailOptions } from "../notifications/confirmEmail";
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
        mailOptions(user.email, user.activationCode, "http://localhost:3000")
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
    res.redirect("/auth");
  } catch (errors) {
    req.flash("error", "Can't find a user with that activation code.");
    res.redirect("/auth");
  }
});

export { router as authController };
