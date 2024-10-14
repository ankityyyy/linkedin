import { Router } from "express";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUsersProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
} from "../controllers/user.controller.js";
import multer from "multer";

import { wrapAsync } from "../utils/wrapAsync.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);
router.route("/register").post(wrapAsync(register));
router.route("/login").post(wrapAsync(login));
router.route("/user_update").post(wrapAsync(updateUserProfile));
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(wrapAsync(updateProfileData));
router.route("/user/get_all_users").get(getAllUsersProfile);
router.route("/user/dawnload_resume/:id").get(downloadProfile);
router
  .route("/user/send_connection_request")
  .post(wrapAsync(sendConnectionRequest));
router.route("/user/getConnectionRequest").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router
  .route("/user/accept_connection_request")
  .post(wrapAsync(acceptConnectionRequest));

export default router;
