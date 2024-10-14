import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  body: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Typo fix
  media: { type: String, default: "" },
  active: { type: Boolean, default: true },
  fileType: { type: String, default: "" },
});

const Post = mongoose.model("Post", postSchema); // Corrected the export name

export { Post }; // Exporting with the correct name
