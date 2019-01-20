import express = require("express");
const router = express.Router();
import { NextFunction, Request, Response } from "express";

import { validationResult } from "express-validator/check";
import { User } from "../models/User";
import { passport, unauthOnly } from "../passport";
import { registerValidator } from "../validators/authValidator";

// Show auth form
router.get("/auth", unauthOnly("/profile/me"), (req, res) => {
  res.render("auth", { title: "Login", error: req.flash("error") });
});

// Handle auth request
router.post("/auth", passport.authenticate("local", { failureFlash: true, failureRedirect: "/auth" }), (req, res) => {
  res.render("index", { user: req.user });
});

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
router.post("/register", registerValidator, unauthOnly("/profile/me"), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("errors", JSON.stringify(errors.mapped()));
    req.flash("form", JSON.stringify({ email: req.body.email, name: req.body.name }));
    return res.redirect("/register");
  }
  // If validation passed, proceed to register user
  const { email, name, password } = req.body;
  const user = new User({ email, name, password });
  user
    .save()
    .then(newUser => {
      req.login(newUser, err => {
        if (err) return res.redirect(500, "/");
        res.redirect("profile/me");
      });
    })
    .catch(err => {
      // TODO: if user email/name already exists?
      // see what errors and in what format mongoose passes
      req.flash("error", "Something went wrong, please try again later.");
      res.redirect("back");
    });
});

export { router as authController };