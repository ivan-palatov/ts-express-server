"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const _ = require("lodash");
const passport = require("passport");
exports.passport = passport;
const passportLocal = require("passport-local");
const User_1 = require("./models/User");
// Config passport to use local strategy
// tslint:disable-next-line
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
    User_1.User.findOne({ email: email.toLowerCase() })
        .then(user => {
        if (!user) {
            return done(undefined, false, {
                message: `User with email ${email} not found.`
            });
        }
        user.validatePassword(password, (err, isMatch) => {
            if (err)
                return done(err);
            // TODO: isActive check
            if (isMatch)
                return done(undefined, _.omit(user, "password"));
            return done(undefined, false, {
                message: "Invalid email or password."
            });
        });
    })
        .catch(err => done(err));
}));
passport.serializeUser((user, done) => {
    done(undefined, user.id);
});
passport.deserializeUser((id, done) => {
    User_1.User.findById(id, (err, user) => {
        done(err, user);
    });
});
// Allow only authenticated users and send the rest to redirectPath
exports.authOnly = (redirectPath) => (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect(redirectPath);
};
// Allow only unauthenticated users and send the rest to redirectPath
exports.unauthOnly = (redirectPath) => (req, res, next) => {
    if (req.isUnauthenticated())
        return next();
    res.redirect(redirectPath);
};
//# sourceMappingURL=passport.js.map