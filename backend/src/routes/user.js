const express=require('express');
const router=express.Router();
const userController=require("../controller/user.js");
const  wrapasync=require("../utils/wrapAsync.js")
const {validate}=require("../middleware.js")
const {userSchemaRegister,userSchemaLogin}=require("../schema.js")


router.post("/register",validate(userSchemaRegister),wrapasync(userController.userRgister))
router.post("/login",validate(userSchemaLogin),wrapasync(userController.userLogin));

module.exports=router;