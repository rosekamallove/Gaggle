const express = require("express");
const app = express();
const PORT = 3003;

const server = app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

app.set("view engine", "pug");
app.set("views", "views");

app.get("/", (req, res, next) => {
  let payload = {
    pageTitle: "Home",
  };
  res.status(200).render("home", payload);
});
