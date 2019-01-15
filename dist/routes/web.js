"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController = require("../controllers/auth");
const api_1 = require("./api");
// Auth routes
const authRouter = express.Router();
authRouter.get('/', authController.index);
authRouter.get('/create', authController.create);
authRouter.post('/', authController.store);
authRouter.get('/:id', authController.show);
authRouter.get('/:id/edit', authController.edit);
authRouter.patch('/:id', authController.update);
authRouter.delete('/:id', authController.destroy);
api_1.default.use("/auth", authRouter);
// Other routes
api_1.default.get("*", (req, res) => {
    res.render("index", { stuff: "Realy cool paragraph." });
});
exports.default = api_1.default;
//# sourceMappingURL=web.js.map