import { user } from "../models/user.model.js";
import { profile } from "../models/profile.model.js";
import { Post } from "../models/posts.model.js";

export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const User = await user.findOne({ token: token });

    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();

    return res.status(200).json({ message: "post created" });
    // res.send("hello");
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await post
      .find()
      .populate("userId", "name userName email profilePicture");
    return res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const index = (req, res) => {
  res.render("test.ejs");
};
