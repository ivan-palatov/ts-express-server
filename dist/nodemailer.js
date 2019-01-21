"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
exports.transporter = nodemailer.createTransport({
    auth: {
        pass: process.env.MAIL_USER,
        user: process.env.MAIL_PASS
    },
    service: "gmail"
}, { from: process.env.MAIL_FROM });
//# sourceMappingURL=nodemailer.js.map