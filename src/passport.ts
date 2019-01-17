import { NextFunction, Request, Response } from "express";
import passport = require("passport");
import passportLocal = require("passport-local");

import { User } from "./models/User";

// Config passport to use local strategy

// tslint:disable-next-line
const LocalStrategy = passportLocal.Strategy;
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() })
      .then(user => {
        if (!user) {
          return done(undefined, false, {
            message: `User with email ${email} not found.`
          });
        }
        user.validatePassword(password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(undefined, user);
          return done(undefined, false, {
            message: "Invalid email or password."
          });
        });
      })
      .catch(err => done(err));
  })
);

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Allow only authenticated users middleware
export const authOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

// Allow only unauthenticated users middleware
export const unauthOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isUnauthenticated()) return next();
  res.redirect("back");
};
