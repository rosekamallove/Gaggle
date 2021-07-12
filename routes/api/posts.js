const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schema/UserSchema");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {});

router.post("/", async (req, res, next) => {
  if (!req.body.content) {
    console.error("content param not send with request");
    return res.status(400).send("Bad request");
  }
  res.status(200).send("Post Saved");
});

module.exports = router;
