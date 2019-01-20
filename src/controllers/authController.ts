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
  let errors = req.flash("errors")[0];
  errors = errors ? JSON.parse(errors) : null;
  res.render("register", { errors, title: "Register" });
});

// Handle register request
router.post("/register", registerValidator, unauthOnly("/profile/me"), (req: Request, res: Response) => {
  const errors = validationResult(req);
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

export { router as authController };