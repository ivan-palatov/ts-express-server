"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const middleware_1 = require("../middleware");
const apiRouter = express.Router();
apiRouter.get("*", (req, res) => {
    res.json({ test: "This is api in work." });
});
middleware_1.default.use("/api", apiRouter);
exports.default = middleware_1.default;
//# sourceMappingURL=api.js.map