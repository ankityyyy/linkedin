const mongoose = require("mongoose");

const postSchema=new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     body: { type: String, required: true },
     likes: { type: Number, default: 0 },
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now }, // Typo fix
     media: { type: String, default: "" },
     active: { type: Boolean, default: true },
     fileType: { type: String, default: "" },
})

const post=mongoose.model("Post",postSchema);
module.exports=post; 