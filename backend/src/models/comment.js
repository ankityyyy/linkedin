const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  body: { type: String, required: true },
});

const comment=mongoose.model("Comment",commentSchema);
module.exports=comment;