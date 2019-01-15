import express = require("express");
import app from "../middleware";
const apiRouter = express.Router();

apiRouter.get("*", (req, res) => {
  res.json({ test: "This is api in work." });
});

app.use("/api", apiRouter);

export default app;
