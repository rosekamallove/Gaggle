const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pinned: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", PostSchema);
module.exports = User;
