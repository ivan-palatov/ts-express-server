"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const web_1 = require("./routes/web");
web_1.default.set("views", path.join(__dirname, "../public/views"));
web_1.default.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
web_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map