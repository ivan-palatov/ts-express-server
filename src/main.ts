import dotenv = require("dotenv");
import mongoose = require("mongoose");
import path = require("path");

// Parse config settings to process.env
dotenv.config({ path: path.join(__dirname, "../config/.env") });

import { app } from "./middleware";

// Connect to mongoDB
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
let connect: string;
if (!DB_USER && !DB_PASSWORD) {
  connect = `mongodb://${DB_HOST}/${DB_NAME}`;
} else {
  connect = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
}
mongoose
  .connect(connect, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .catch(err => console.log("MongoDB connect error. ", err));

// View engine settings
app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "pug");

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
