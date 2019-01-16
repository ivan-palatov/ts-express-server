"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");
const expressStaticGzip = require("express-static-gzip");
// Routes import statements
const api_1 = require("./routes/api");
const web_1 = require("./routes/web");
// Creating the server
const app = express();
exports.app = app;
// Apply all middleware here
// Apply compression on response
app.use(compression());
// Parse the body into middleware before request handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Make server serve static pre-compressed files using gzip or brotli algoritms
app.use(expressStaticGzip("public", {
    enableBrotli: true
}));
// Use routes
app.use("/api", api_1.apiRoutes);
app.use("/", web_1.webRoutes);
//# sourceMappingURL=middleware.js.map