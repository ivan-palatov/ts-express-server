import express = require("express");
const router = express.Router();

import { User } from "../models/User";
import { passport, unauthOnly } from "../passport";

// Show list of users
router.get("/list", (req, res) => {
  User.find()
    .then(docs => {
      res.render("auth", { text: `List of users: ${docs}` });
    })
    .catch(err => {
      res.render("auth", { text: `Something went wrong. ${err}` });
    });
});

// Show create user form
router.get("/", unauthOnly("/profile/me"), (req, res) => {
  res.render("auth", { title: "Login", error: req.flash("error") });
});

// Create a new user
router.post(
  "/",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/auth"
  }),
  (req, res) => {
    res.render("index", { text: "Your user has been created" });
  }
);

// Show a user by id
router.get("/:id", (req, res) => {
  res.render("auth", { text: `User ${req.params.id} is being shown.` });
});

// Show edit form for user
router.get("/:id/edit", (req, res) => {
  res.render("auth", { text: `Edit page for ${req.params.id} user.` });
});

// Edit user by id
router.patch("/:id", (req, res) => {
  res.render("auth", { text: `User ${req.params.id} is being updated.` });
});

// Delete user by id
router.delete("/:id", (req, res) => {
  res.render("auth", { text: `You deleted ${req.params.id} user.` });
});

export { router as authController };
