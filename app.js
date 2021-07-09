const express = require("express");
const app = express();
const PORT = 3003;
const middleware = require("./middleware");
const path = require("path");

const server = app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

/* Routes */
const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: "Home",
  };
  res.status(200).render("home", payload);
});