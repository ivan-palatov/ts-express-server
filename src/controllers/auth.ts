import express = require("express");
const router = express.Router();

import { User } from "../models/User";

// Show list of users
router.get("/", (req, res) => {
  User.find()
    .then(docs => {
      res.render("auth", { text: `List of users: ${docs}` });
    })
    .catch(err => {
      res.render("auth", { text: `Something went wrong. ${err}` });
    })
});

// Show create user form
router.get("/create", (req, res) => {
  res.render("auth", { text: "Make user here" });
});

// Create a new user
router.post("/", (req, res) => {
  res.render("auth", { text: "Your user is being created" });
});

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
