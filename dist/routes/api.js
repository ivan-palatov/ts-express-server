"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
exports.apiRoutes = router;
router.get("*", (req, res) => {
    res.json({ test: "This is api in work." });
});
//# sourceMappingURL=api.js.map