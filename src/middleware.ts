import express = require("express");
import expressStaticGzip = require("express-static-gzip");

// Apply all middleware before api and web routes

const app = express();

app.use(
  expressStaticGzip("public", {
    enableBrotli: true
  })
);

export default app;
