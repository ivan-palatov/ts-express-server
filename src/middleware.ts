import express = require("express");
import expressStaticGzip = require("express-static-gzip");

// Routes import statements
import { apiRoutes } from "./routes/api";
import { webRoutes } from "./routes/web";
// Creating the server
const app = express();

// Apply all middleware here

// Make server work with gz and br compression
app.use(
  expressStaticGzip("public", {
    enableBrotli: true
  })
);

// Use routes
app.use("/api", apiRoutes);
app.use("/", webRoutes);

export { app };
