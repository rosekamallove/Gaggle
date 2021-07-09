const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schema/UserSchema");

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("login");
});

router.post("/", async (req, res, next) => {
  const payload = req.body;

  if (req.body.logUsername && req.body.logPassword) {
    const user = await User.findOne({
      $or: [
        { username: req.body.logUsername },
        { password: req.body.logPassword },
      ],
    }).catch((err) => {
      console.log(err);
      payload.errorMessage = "Something went wrong";
      res.status(200).render("login", payload);
    });

    if (user != null) {
      const correctPassword = await bcrypt.compare(
        req.body.logPassword,
        user.password
      );
      if (correctPassword) {
        req.session.user = user;
        return res.redirect("/");
      }
    }
    payload.errorMessage = "Incorrect Password or Email";
    return res.status(200).render("login", payload);
  }
  payload.errorMessage = "Incorrect Password or Email";
  res.status(200).render("login", payload);
});

module.exports = router;
