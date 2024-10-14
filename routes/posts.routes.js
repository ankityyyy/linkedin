import { Router } from "express";
import multer from "multer";
import path from "path";

import {
  createPost,
  getAllPost,
  index,
} from "../controllers/posts.controller.js";

const router = Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const uploads = multer({ storage: storage });

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique name for each file
  },
});

// Initialize upload
const uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Optional: File type validation (e.g., images only)
    const filetypes = "/jpeg|jpg|png|gif";
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

router.route("/posts").post(uploads.single("media"), createPost);
// router.route("/").get(getAllPost);
// // router.route("/").get(createPost);
router.route("/create").get(index);

export default router;
