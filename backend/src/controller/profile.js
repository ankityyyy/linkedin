const user = require("../models/user.js");
const ExpressError = require("../utils/expressError.js");
const { StatusCodes } = require("http-status-codes");
const Profile = require("../models/profile.js");
const connection = require("../models/connections.js");

const uploadProfilePicture = async (req, res, next) => {
  if (!req.file) {
    return next(new ExpressError("No file uploaded", StatusCodes.BAD_REQUEST));
  }
  let url = req.file.path;
  let filename = req.file.filename;

  let foundUser = req.user;

  foundUser.profilePicture = { url, filename };
  await foundUser.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: "User profilePicture updated" });
};

const updateUserProfile = async (req, res, next) => {
  let { ...newUserData } = req.body;
  let foundUser = req.user;

  //      const allowedFields = ['name', 'number'];
  // allowedFields.forEach(field => {
  //   if (req.body[field] !== undefined) {
  //     foundUser[field] = req.body[field];
  //   }
  // });
  // await foundUser.save();

  Object.assign(foundUser, newUserData);
  await foundUser.save();

  return res.status(StatusCodes.OK).json({ message: "User profile updated" });
};

const getUserAndProfile = async (req, res, next) => {
  let foundUser = req.user;

  let userProfile = await Profile.findOne({ userId: foundUser._id }).populate(
    "userId",
    "name email username profilePicture"
  );

  if (!userProfile) {
    return next(new ExpressError("Profile not found", StatusCodes.NOT_FOUND));
  }
  return res.json({profile:userProfile,message:"User Profile Send"});
};

const updateProfileData = async (req, res, next) => {
  let foundUser = req.user;
  let { ...profileData } = req.body;

  let userProfile = await Profile.findOne({ userId: foundUser._id });
  if (!userProfile) {
    return next(new ExpressError("Profile not found", StatusCodes.NOT_FOUND));
  }

  Object.assign(userProfile, profileData);
  let data = await userProfile.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: "User profile updated successfully", user: data });
};

const getUserAndProfileAll = async (req, res) => {
  let userProfile = await Profile.find().populate(
    "userId",
    "name email username profilePicture"
  );
  return res.status(StatusCodes.OK).json({allUserProfile:userProfile,message: "All user profiles fetched successfully"});
};

const sendConnectionRequest = async (req, res, next) => {
  let foundUser = req.user;

  let { connectionId } = req.body;

  const connectionUser = await user.findOne({ _id: connectionId });
  if (!connectionUser) {
    return next(
      new ExpressError("connection User not found", StatusCodes.NOT_FOUND)
    );
  }

  let existingRequest = await connection.findOne({
    userId: foundUser._id,
    connectionId: connectionUser._id,
  });

  if (existingRequest) {
    return next(
      new ExpressError("request already send", StatusCodes.BAD_REQUEST)
    );
  }

  const newRequest = new connection({
    userId: foundUser._id,
    connectionId: connectionUser._id,
  });

  await newRequest.save();
  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Connection request sent successfully" });
};

const getMyConnectionRequest = async (req, res) => {
  let foundUser = req.user;

  const connections = await connection
    .find({ userId: foundUser._id })
    .populate("connectionId", "name email username profilePicture");

  return res.status(StatusCodes.CREATED).json({ sentConnections: connections });
};

const whatAreMyConnections = async (req, res) => {
  let foundUser = req.user;

  const connections = await connection
    .find({ connectionId: foundUser._id })
    .populate("userId", "name email username profilePicture");

  return res.status(StatusCodes.OK).json({ receivedConnections: connections });
};

const acceptConnectionRequest=async(req,res,next)=>{
  let foundUser = req.user;
  let { connectionId , action_type} = req.body;

  const connectionUser = await user.findOne({ _id: connectionId });
  if (!connectionUser) {
    return next(
      new ExpressError("connection User not found", StatusCodes.NOT_FOUND)
    );
  }

  if (action_type === "accept") {
    connection.status_accepted = true;
  } else {
    connection.status_accepted = false;
  }

  await connection.save();
  return res.json({ message: "Request Updated" });
}

 const getuserbasedonusername=async(req,res)=>{
  let {username}=req.query;
  
  let User=await user.findOne({username});
  let userProfile = await Profile.find({userId:User._id}).populate(
    "userId",
    "name email username profilePicture"
  );
  return res.status(StatusCodes.OK).json({UserProfilebasedonusername:userProfile,message: " user profiles fetched based on username"});
}
module.exports = {
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getUserAndProfileAll,
  sendConnectionRequest,
  whatAreMyConnections,
  getMyConnectionRequest,
  acceptConnectionRequest,
  getuserbasedonusername
};
