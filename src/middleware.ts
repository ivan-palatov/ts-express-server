import bodyParser = require("body-parser");
import compression = require("compression");
// import connectMongo = require("connect-mongo");
import express = require("express");
// tslint:disable-next-line
// import session = require("express-session");
import expressStaticGzip = require("express-static-gzip");
// import mongoose = require("mongoose");
import passport = require("passport");

// import { connectString } from "./main";

// Routes import statements
import { apiRoutes } from "./routes/api";
import { webRoutes } from "./routes/web";
// Creating the server
const app = express();
// Creating session store
// tslint:disable-next-line
// const MongoStore = connectMongo(session);


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
// Session middleware
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//     store: new MongoStore({
//       autoReconnect: true,
//       mongooseConnection: mongoose.connection
//     })
//   })
// );
// // Apply passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

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
