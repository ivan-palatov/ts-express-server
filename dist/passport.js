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
// tslint:disable-next-line
const _ = require("lodash");
const passport = require("passport");
exports.passport = passport;
const passportLocal = require("passport-local");
const User_1 = require("./models/User");
// Config passport to use local strategy
// tslint:disable-next-line
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return done(undefined, false, {
                message: `User with email ${email} not found.`
            });
        }
        const isMatch = yield user.validatePassword(password);
        if (isMatch) {
            if (user.isActive)
                return done(undefined, _.omit(user, "password"));
            return done(undefined, false, {
                message: "User is not active. Check your email to activate."
            });
        }
        return done(undefined, false, {
            message: "Invalid email or password."
        });
    }
    catch (err) {
        done(err);
    }
})));
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