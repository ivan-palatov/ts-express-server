import app from "./api";

app.get("*", (req, res) => {
  res.render("index", { stuff: "Realy cool paragraph." });
});

export default app;
