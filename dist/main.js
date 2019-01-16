"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const middleware_1 = require("./middleware");
// View engine settings
middleware_1.app.set("views", path.join(__dirname, "../public/views"));
middleware_1.app.set("view engine", "ejs");
// Start server
const PORT = process.env.PORT || 3000;
middleware_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map