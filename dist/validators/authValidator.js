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
        .normalizeEmail(),
    check_1.body("name")
        .exists()
        .withMessage("Name field is required.")
        .isString()
        .withMessage("Name must be a string.")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Name must contain more than 3 but less than 30 symbols.")
        .matches(/[A-Za-z0-9-_ ]*/)
        .withMessage("Nickname can contain only letters, numbers, spaces, dashes and underscores."),
    check_1.body("password")
        .exists()
        .withMessage("Password field is required.")
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