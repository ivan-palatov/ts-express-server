import { body } from "express-validator/check";

export const registerValidator = [
  body("email")
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
  body("name")
    .exists()
    .withMessage("Name field is required.")
    .isString()
    .withMessage("Name must be a string.")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must contain more than 3 but less than 30 symbols.")
    .matches(/[A-Za-z0-9-_ ]*/)
    .withMessage("Nickname can contain only letters, numbers, spaces, dashes and underscores."),
  body("password")
    .exists()
    .withMessage("Password field is required.")
    .isString()
    .withMessage("Password should be a string.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)
    .withMessage(
      "Password should be at least 8 symbols long, contain at least one number and one letter."
    ),
  body("password2")
    .exists()
    .withMessage("Password confirmation field is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      } else {
        return value;
      }
    })
];

export const authValidator = [
  body("email")
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
  body("password")
    .exists()
    .withMessage("Password field is required.")
    .isString()
    .withMessage("Password should be a string")
];
