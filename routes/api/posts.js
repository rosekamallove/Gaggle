const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schema/UserSchema");
const Post = require("../../schema/PostSchema");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**********************************
 * Handles Retrivale of The Posts *
 **********************************/
router.get("/", (req, res, next) => {
  Post.find()
    .populate("postedBy")
    .then((posts) => res.status(200).send(posts))
    .catch((err) => console.log(err));
});

/********************************
 * Handles Creation of The Posts *
 *********************************/
router.post("/", async (req, res, next) => {
  if (!req.body.content) {
    console.error("content param not send with request");
    return res.status(400).send("Bad request");
  }

  const postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  Post.create(postData)
    .then(async (newPost) => {
      newPost = await User.populate(newPost, { path: "postedBy" });
      res.status(201).send(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = router;
