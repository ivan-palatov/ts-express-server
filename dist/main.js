"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
// Parse config settings to process.env
dotenv.config({ path: path.join(__dirname, "../config/.env") });
const middleware_1 = require("./middleware");
// Connect to mongoDB
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
mongoose
    .connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, { useNewUrlParser: true })
    .catch(err => console.log("MongoDB connect error. ", err));
// View engine settings
middleware_1.app.set("views", path.join(__dirname, "../public/views"));
middleware_1.app.set("view engine", "ejs");
// Start server
const PORT = process.env.PORT || 3000;
middleware_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map