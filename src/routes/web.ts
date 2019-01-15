import express = require("express");

import * as authController from "../controllers/auth";
import app from "./api";

// Auth routes
const authRouter = express.Router();

authRouter.get('/', authController.index);
authRouter.get('/create', authController.create);
authRouter.post('/', authController.store);
authRouter.get('/:id', authController.show);
authRouter.get('/:id/edit', authController.edit);
authRouter.patch('/:id', authController.update);
authRouter.delete('/:id', authController.destroy);

app.use("/auth", authRouter);

// Other routes
app.get("*", (req, res) => {
  res.render("index", { stuff: "Realy cool paragraph." });
});

export default app;
