const express = require("express");
const router = express.Router();
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage});
const {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  comment,
  getAllPostComment,
  deletePostComment,
  incLike,
} = require("../controller/post.js");
const wrapasync = require("../utils/wrapAsync.js");
const {
  validate,
  owner,
  validateTokenAndFindUser,
  commentOwner,
} = require("../middleware.js");
const { CreatepostSchema, updatePostSchema } = require("../schema.js");

// router.post("/create",createPost)
// router.get('/',getAllPost)
// router.patch('/:id',updatePost);
// router.delete('/:id',deletePost);
router
  .route("/")
  .post(
    upload.single("media"), 
    validateTokenAndFindUser,
    validate(CreatepostSchema),
    wrapasync(createPost)
  )
  .get(wrapasync(getAllPost));

router
  .route("/:id")
  .patch(
    validateTokenAndFindUser,
    owner,
    validate(updatePostSchema),
    wrapasync(updatePost)
  )
  .delete(validateTokenAndFindUser, owner, wrapasync(deletePost));

router.route("/like/:id").post( wrapasync(incLike));
router
  .route("/comment/:postId")
  .post(validateTokenAndFindUser, wrapasync(comment))
  .get(wrapasync(getAllPostComment));

router
  .route("/delete/:commentId")
  .delete(validateTokenAndFindUser, commentOwner, wrapasync(deletePostComment));

module.exports = router;
