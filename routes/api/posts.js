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
    .sort({ createdAt: -1 })
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

/********************************
 *  Handles Likes of The Posts  *
 *********************************/
router.put("/:id/like", async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;
  const isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);

  const option = isLiked ? "$pull" : "$addToSet";

  /* Inserting like to UserDB */
  req.session.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: { likes: postId },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  /* Inserting like to PostDB */
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { likes: userId },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });
  res.status(200).send(post);
});

module.exports = router;
