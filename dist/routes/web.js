"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
api_1.default.get("*", (req, res) => {
    res.render("index", { stuff: "Realy cool paragraph." });
});
exports.default = api_1.default;
//# sourceMappingURL=web.js.map