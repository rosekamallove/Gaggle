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
  res.status(200).render("register");
});

/* User Registration Post */
router.post("/", async (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const passwordField = req.body.password;
  const passwordConfirmField = req.body.passwordConf;

  const payload = req.body;

  if (firstName && lastName && username && email) {
    /*
     * Checking for duplicate username or password,
     * else inserting the user in DB
     */
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((err) => {
      console.log(err);
      payload.errorMessage = "Something went wrong";
      res.status(200).render("register", payload);
    });

    if (user == null) {
      // No user found
      var data = req.body;
      data.password = await bcrypt.hash(passwordField, 10);
      User.create(data)
        .then((user) => {
          console.log(user);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // User Found
      if (email == user.email) {
        payload.errorMessage = "Email already in use";
      } else {
        payload.errorMessage = "Username already in use";
      }
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure that all the fields have proper value";
    res.status(200).render("register", payload);
  }
});

module.exports = router;
