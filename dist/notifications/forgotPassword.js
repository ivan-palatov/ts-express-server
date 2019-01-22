"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordOptions = (to, actCode, siteAddress) => {
    return {
        to,
        subject: "Confirm your email.",
        text: `You recieved this message because someone used this email to register on ${siteAddress} . 
      If it wasn't you, just ignore this message. If it was you, please follow this link: 
      ${siteAddress}/activate/${actCode}`,
        html: ``
    };
};
//# sourceMappingURL=forgotPassword.js.map