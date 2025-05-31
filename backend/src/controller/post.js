const Post = require("../models/post.js");
const ExpressError = require("../utils/expressError.js");
const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/comment.js");

const createPost = async (req, res, next) => {
  const foundUser = req.user;

  const newPost = new Post({
    userId: foundUser.id,
    body: req.body.body,
    media: req.file ? req.file.filename : "",
    fileType: req.file ? req.file.mimetype.split("/")[1] : "",
  });

  await newPost.save();
  return res.status(StatusCodes.CREATED).json({ message: "Post created" });
};

const getAllPost = async (req, res) => {
  const allPost = await Post.find().populate(
    "userId",
    "name username email profilePicture"
  );
  return res.status(StatusCodes.OK).json({ post: allPost });
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const updateData = await Post.findByIdAndUpdate(id, req.body, { new: true });
  
  if (!updateData) {
    return next(new ExpressError("Post not found", StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({ message: "Post updated", post: updateData });
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const deletedPost = await Post.findByIdAndDelete(id);

  if (!deletedPost) {
    return next(new ExpressError("Post not deleted", StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({ message: "Post deleted", post: deletedPost });
};

const comment = async (req, res, next) => {
  const { commentBody } = req.body;
  const { postId } = req.params;
  const foundUser = req.user;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ExpressError("Post not found", StatusCodes.NOT_FOUND));
  }

  const newComment = new Comment({
    userId: foundUser._id,
    postId: postId,
    comment: commentBody,
  });

  await newComment.save();
  return res.status(StatusCodes.CREATED).json({
    message: "New comment added to post",
    comment: newComment,
  });
};

const getAllPostComment = async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ExpressError("Post not found", StatusCodes.NOT_FOUND));
  }

  const allComment = await Comment.find({ postId }).populate("userId", "username");
  return res.status(StatusCodes.OK).json({
    message: "All comments for the post",
    allComment,
  });
};

const deletePostComment = async (req, res, next) => {
  const { commentId } = req.params;

  const existComment = await Comment.findById(commentId);
  if (!existComment) {
    return next(new ExpressError("Comment not found", StatusCodes.NOT_FOUND));
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  return res.status(StatusCodes.OK).json({
    message: "Comment deleted successfully",
    deletedComment,
  }); 
}; 
 
const incLike = async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return next(new ExpressError("Post not found", StatusCodes.NOT_FOUND));
  } 

  post.likes += 1;
  await post.save();

  return res.status(StatusCodes.OK).json({
    message: "Like incremented successfully",
    likes: post.likes,
  });
};

module.exports = {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  comment,
  getAllPostComment,
  deletePostComment,
  incLike
};
