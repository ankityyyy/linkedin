const express=require('express');
const router=express.Router();
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage});
const {uploadProfilePicture,updateUserProfile,getUserAndProfile,updateProfileData,getUserAndProfileAll,sendConnectionRequest, getMyConnectionRequest,whatAreMyConnections,acceptConnectionRequest,getuserbasedonusername}=require("../controller/profile.js")
const {validateTokenAndFindUser, profileOwner}=require("../middleware.js")
const  wrapasync=require("../utils/wrapAsync.js")
const {validate}=require("../middleware.js")
  

router.patch('/profile-pictureupload',validateTokenAndFindUser,upload.single('image'),
wrapasync(uploadProfilePicture));
router.patch("/profile/data",validateTokenAndFindUser,wrapasync(updateUserProfile))
router.get("/profile",validateTokenAndFindUser,wrapasync(getUserAndProfile))
router.get("/profiles",wrapasync(getUserAndProfileAll))
router.get("/getuserbasedonusername",wrapasync(getuserbasedonusername))
router.patch("/profiles/data",validateTokenAndFindUser,wrapasync(updateProfileData))
router.post("/connections",validateTokenAndFindUser,wrapasync(sendConnectionRequest));
router.get("/connections/sent",validateTokenAndFindUser,wrapasync(getMyConnectionRequest))
router.get("/connections/received",validateTokenAndFindUser,wrapasync(whatAreMyConnections))
router.post("/connections/respond",validateTokenAndFindUser,wrapasync(acceptConnectionRequest))


 
module.exports=router;  