import path = require("path");

import app from "./routes/web";

app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
