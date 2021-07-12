const express = require("express");
const app = express();
const PORT = 3000;
const middleware = require("./middleware");
const path = require("path");
const mongoose = require("./databse");
const session = require("express-session");

const server = app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "skdfjksdfjaskdfajdsf",
    resave: true,
    saveUninitialized: false,
  })
);

/* Routes */
const loginRoute = require("./routes/loginRoutes");
const logoutRoute = require("./routes/logout");
const registerRoute = require("./routes/registerRoutes");
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

/* API Routes */
const postsRoute = require("./routes/api/posts");
app.use("/api/posts", postsRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: "Home",
    userLoggedin: req.session.user,
  };
  res.status(200).render("home", payload);
});
