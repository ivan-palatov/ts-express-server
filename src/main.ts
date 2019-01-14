import express = require("express");
import path = require("path");
import expressStaticGzip = require("express-static-gzip");

const app = express();

app.use(
  expressStaticGzip("public", {
    enableBrotli: true
  })
);

app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "ejs");

app.get("*", (req, res) => {
  res.render("index", { stuff: "Theres a lot of things to write about" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
