const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schema/UserSchema");
const Post = require("../../schema/PostSchema");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**********************************
 * Handles @Retrivale of The Posts *
 **********************************/
router.get("/", async (req, res, next) => {
  /*
  Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({ createdAt: -1 })
    .then(async (posts) => {
      posts = await User.populate(posts, { path: "retweetData.postedBy" });
      res.status(200).send(posts);
    })
    .catch((err) => console.log(err));
*/
  const posts = await getPosts({});
  res.status(200).send(posts);
});

/**********************************
 * @Retrivale of The Reply Posts *
 **********************************/
router.get("/:id", async (req, res, next) => {
  const postId = req.params.id;

  // returns an array
  const posts = await getPosts({ _id: postId });
  res.status(200).send(posts[0]);
});

/********************************
 * Handles @Creation of The Posts *
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
 *  Handles @Likes of The Posts  *
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

/*********************************
 * Handles @Retweet of The Posts *
 *********************************/
router.post("/:id/retweet", async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user._id;

  /* retweeted ? delete */
  const deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId,
  }).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  const option = deletedPost != null ? "$pull" : "$addToSet";
  var repost = deletedPost;

  if (repost == null) {
    repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
      (err) => {
        console.log(err);
        res.sendStatus(400);
      }
    );
  }

  /* Inserting retwet to UserDB */
  req.session.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: { retweets: repost._id },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  /* Inserting retweets to PostDB */
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { retweetUsers: userId },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  res.status(200).send(post);
});

/**********************************
 *    Get Posts with @post_id     *
 **********************************/
async function getPosts(filter) {
  const posts = Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .sort({ createdAt: -1 })
    .catch((err) => console.log(err));

  return await User.populate(posts, { path: "retweetData.postedBy" });
}
module.exports = router;
