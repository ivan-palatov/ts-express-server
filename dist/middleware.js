"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expressStaticGzip = require("express-static-gzip");
// Apply all middleware before api and web routes
const app = express();
app.use(expressStaticGzip("public", {
    enableBrotli: true
}));
exports.default = app;
//# sourceMappingURL=middleware.js.map