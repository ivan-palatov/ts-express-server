"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const compression = require("compression");
const connectFlash = require("connect-flash");
const connectMongo = require("connect-mongo");
const cookieParser = require("cookie-parser");
const express = require("express");
// tslint:disable-next-line
const session = require("express-session");
const expressStaticGzip = require("express-static-gzip");
const mongoose = require("mongoose");
const passport_1 = require("./passport");
// Routes import statements
const api_1 = require("./routes/api");
const web_1 = require("./routes/web");
// Creating the server
const app = express();
exports.app = app;
// Creating session store
// tslint:disable-next-line
const MongoStore = connectMongo(session);
// Import and apply dev only middleware
if (process.env.NODE_ENV === "development") {
    // Sends full error stack traces back to the client, only for development
    Promise.resolve().then(() => require("errorhandler")).then(errorhandler => {
        app.use(errorhandler());
    });
    // Request logger, could be used in production
    Promise.resolve().then(() => require("morgan")).then(morgan => {
        app.use(morgan("dev"));
    });
}
// Apply middleware here
// Apply compression on response
app.use(compression());
// Parse the body into middleware before request handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
// Session middleware
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        autoReconnect: true,
        mongooseConnection: mongoose.connection
    })
}));
app.use(connectFlash());
// Apply passport middleware
app.use(passport_1.passport.initialize());
app.use(passport_1.passport.session());
// Make server serve static pre-compressed files(if they exist) using gzip or brotli algoritms
app.use(expressStaticGzip("public", {
    enableBrotli: true
}));
// Use routes
app.use("/api", api_1.apiRoutes);
app.use("/", web_1.webRoutes);
//# sourceMappingURL=middleware.js.map