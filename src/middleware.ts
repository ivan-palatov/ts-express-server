import bodyParser = require("body-parser");
import compression = require("compression");
import express = require("express");
import expressStaticGzip = require("express-static-gzip");

// Routes import statements
import { apiRoutes } from "./routes/api";
import { webRoutes } from "./routes/web";
// Creating the server
const app = express();

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

// Make server serve static pre-compressed files using gzip or brotli algoritms
app.use(
  expressStaticGzip("public", {
    enableBrotli: true
  })
);

// Use routes
app.use("/api", apiRoutes);
app.use("/", webRoutes);

export { app };
