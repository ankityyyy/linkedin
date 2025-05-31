const User=require("../models/user.js")
const ExpressError=require("../utils/expressError.js")
const bcrypt=require("bcrypt");
const crypto=require("crypto");
// const httpStatus=require("http-status");
const { StatusCodes } = require("http-status-codes");

const Profile=require("../models/profile.js");


module.exports.userRgister=async(req,res,next)=>{
     const { username, password, name, email, number } = req.body;
     
     const foundUser= await User.findOne({username});

     if(foundUser){
        return   next( new ExpressError("User already exists",StatusCodes.CONFLICT));
     }

     let hashedPassword=await bcrypt.hash(password, 10)

     let newUser=new User({
    username,
    password: hashedPassword, 
    name,
    email,
    number,

     })
     
     await newUser.save();
     console.log(newUser._id )

     const newProfile = new Profile({
          userId: newUser._id,
          profilePicture: {
            filename: "default.jpg",
            url: "uploads/default.jpg"
          }
        });
 
    await newProfile.save();

   
    console.log(newUser)
    console.log(newProfile)
    return res.status(StatusCodes.CREATED).json({ message: "User Registered" });
    

}

module.exports.userLogin=async(req,res,next)=>{
     let {username,password}=req.body;

   const  foundUser= await User.findOne({username});
   if (!foundUser) {
       return next(new ExpressError( "Username is wrong",StatusCodes.NOT_FOUND));
     }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordCorrect) {
     return next(new ExpressError( "Password is worng",StatusCodes.NOT_FOUND));
   }

   const token = crypto.randomBytes(20).toString("hex");
     foundUser.token = token;
     await foundUser.save();
   

     return res.status(StatusCodes.OK).json({ token });

}

