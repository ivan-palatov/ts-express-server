"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expressStaticGzip = require("express-static-gzip");
// Routes import statements
const api_1 = require("./routes/api");
const web_1 = require("./routes/web");
// Creating the server
const app = express();
exports.app = app;
// Apply all middleware here
// Make server work with gz and br compression
app.use(expressStaticGzip("public", {
    enableBrotli: true
}));
// Use routes
app.use("/api", api_1.apiRoutes);
app.use("/", web_1.webRoutes);
//# sourceMappingURL=middleware.js.map