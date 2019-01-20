import bodyParser = require("body-parser");
import compression = require("compression");
import connectFlash = require("connect-flash");
import connectMongo = require("connect-mongo");
import cookieParser = require("cookie-parser");
import express = require("express");
// tslint:disable-next-line
import session = require("express-session");
import expressStaticGzip = require("express-static-gzip");
import expressValidator = require("express-validator");
import mongoose = require("mongoose");
import { passport } from "./passport";

// Routes import statements
import { apiRoutes } from "./routes/api";
import { webRoutes } from "./routes/web";
// Creating the server
const app = express();
// Creating session store
// tslint:disable-next-line
const MongoStore = connectMongo(session);

// Import and apply dev only middleware
if (process.env.NODE_ENV === "development") {
  // Sends full error stack traces back to the client, only for development
  import("errorhandler").then(errorhandler => {
    app.use(errorhandler());
  });
  // Request logger, could be used in production
  import("morgan").then(morgan => {
    app.use(morgan("dev"));
  });
}

// Apply middleware here

// Apply compression on response
app.use(compression());
// Parse the body into middleware before request handlers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser(process.env.SESSION_SECRET));
// Session middleware
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      autoReconnect: true,
      mongooseConnection: mongoose.connection
    })
  })
);
app.use(connectFlash());
// Apply passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Make server serve static pre-compressed files(if they exist) using gzip or brotli algoritms
app.use(
  expressStaticGzip("public", {
    enableBrotli: true
  })
);

// Use routes
app.use("/api", apiRoutes);
app.use("/", webRoutes);

export { app };
