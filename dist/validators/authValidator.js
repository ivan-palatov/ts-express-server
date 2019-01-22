"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
exports.registerValidator = [
    check_1.body("email")
        .exists()
        .withMessage("Email field is required.")
        .isEmail()
        .withMessage("Invalid email address.")
        .trim()
        .normalizeEmail({
        gmail_convert_googlemaildotcom: true,
        gmail_lowercase: true,
        icloud_lowercase: true,
        outlookdotcom_lowercase: true,
        yahoo_lowercase: true
    }),
    check_1.body("name")
        .exists()
        .withMessage("Name field is required.")
        .isString()
        .withMessage("Name must be a string.")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Name must contain more than 3 but less than 30 symbols.")
        .matches(/([0-9-_ *]*[a-zA-Zа-яА-Я][0-9-_ *]*){3,}/)
        .withMessage("Nickname can contain only letters, numbers, spaces, dashes and underscores. Minimum 3 letters."),
    check_1.body("password")
        .exists()
        .withMessage("Password field is required.")
        .isString()
        .withMessage("Password should be a string.")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)
        .withMessage("Password should be at least 8 symbols long, contain at least one number and one letter."),
    check_1.body("password2")
        .exists()
        .withMessage("Password confirmation field is required.")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords must match.");
        }
        else {
            return value;
        }
    })
];
exports.authValidator = [
    check_1.body("email")
        .exists()
        .withMessage("Email field is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .trim()
        .normalizeEmail({
        gmail_convert_googlemaildotcom: true,
        gmail_lowercase: true,
        icloud_lowercase: true,
        outlookdotcom_lowercase: true,
        yahoo_lowercase: true
    }),
    check_1.body("password")
        .exists()
        .withMessage("Password field is required.")
        .isString()
        .withMessage("Password should be a string")
];
exports.emailValidator = [
    check_1.body("email")
        .exists()
        .withMessage("Email field is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .trim()
        .normalizeEmail({
        gmail_convert_googlemaildotcom: true,
        gmail_lowercase: true,
        icloud_lowercase: true,
        outlookdotcom_lowercase: true,
        yahoo_lowercase: true
    })
];
exports.passwordsValidator = [
    check_1.body("password")
        .exists()
        .withMessage("Password field is required.")
        .isString()
        .withMessage("Password should be a string.")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)
        .withMessage("Password should be at least 8 symbols long, contain at least one number and one letter."),
    check_1.body("password2")
        .exists()
        .withMessage("Password confirmation field is required.")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords must match.");
        }
        else {
            return value;
        }
    })
];
//# sourceMappingURL=authValidator.js.map