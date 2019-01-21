import nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.MAIL_USER,
    user: process.env.MAIL_PASS
  },
  service: "gmail"
}, { from:  process.env.MAIL_FROM });
