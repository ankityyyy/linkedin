import bcrypt from "bcrypt";
import crypto from "crypto";
import { user } from "../models/user.model.js";
import { profile } from "../models/profile.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";

function convertUserDataTOPDF(userData) {
  // Create a random file name for the PDF
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  // Create a new PDF document
  const doc = new PDFDocument();

  // Pipe the document to the stream
  doc.pipe(stream);

  // Add user profile picture

  doc.image(
    // userData.userId.profilePicture,
    "C:\\Users\\ankit\\linkedin\\backend\\uploads\\default.jpg",

    { align: "center", width: 100 }
  );
  // Add user details
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.userName}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  // doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  // Add past work experience
  doc.fontSize(14).text("Past Work:");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });
  // Finalize the document
  doc.end();

  return outputPath;
}
export const downloadProfile = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  // const user_id = req.body.id;
  const user_id = id;
  const userProfile = await profile
    .findOne({ userId: user_id })
    .populate("userId", "name userName email profilePicture");

  let outputPath = await convertUserDataTOPDF(userProfile);
  return res.json({ message: outputPath });
};

export const register = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !email || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new user({
      name,
      email,
      password: hashedPassword,
      userName: username,
    });

    // Save the new user
    await newUser.save();

    // Initialize the user's profile
    const Profile = new profile({ userId: newUser._id });
    await Profile.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email
    const foundUser = await user.findOne({ email });

    // Check if user exists
    if (!foundUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Matching the password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a random token (or use JWT for better security)
    const token = crypto.randomBytes(32).toString("hex");

    // Updating the user with the new token
    foundUser.token = token;
    await foundUser.save(); // Save the updated user document

    //     // Updating the user with the new token
    //     await foundUser.updateOne({ _id: foundUser._id }, { token });

    // Send the response with the token
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error); // Log the error on the server side
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    // Ensure token exists
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    // Find user by token
    const foundUser = await user.findOne({ token });

    // Check if user exists
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update the profile picture
    foundUser.profilePicture = req.file.filename;

    // Save user document
    await foundUser.save();

    // Send success response, with the updated profile picture URL (optional)
    return res.json({
      message: "Profile Picture Updated",
      profilePicture: foundUser.profilePicture,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error); // Log the error on the server side
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    // Find user by token
    const foundUser = await user.findOne({ token: token });
    console.log(foundUser);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    // Check if username or email is already taken by another user
    const existingUser = await user.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Update user data
    Object.assign(foundUser, newUserData);

    // Save the updated user
    await foundUser.save();

    res.json({ message: "User profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body; // Extract token from request body
    const sanitizedToken = token.trim(); // Sanitize the token
    console.log("Token received:", sanitizedToken); // Log the received token

    // Find the user by token
    const foundUser = await user.findOne({ token: sanitizedToken });
    console.log("Found User:", foundUser); // Log the found user

    if (!foundUser) {
      // Log all users for debugging
      const allUsers = await user.find();
      console.log("All users:", allUsers);
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's profile using their user ID
    const userProfile = await profile
      .findOne({ userId: foundUser._id }) // Use foundUser._id here
      .populate("userId", "name email username profilePicture");

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return the user's profile as a JSON response
    return res.json(userProfile);
  } catch (error) {
    console.error("Error occurred:", error); // Log the error for debugging
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    // Find the user by token
    const userProfile = await user.findOne({ token: token });

    // If user not found, return 404
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the profile associated with the user
    const profile_to_update = await profile.findOne({
      userId: userProfile._id, // Corrected variable name
    });

    // If profile not found, return 404
    if (!profile_to_update) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update the profile data
    Object.assign(profile_to_update, newProfileData);

    // Save the updated profile
    await profile_to_update.save();

    // Respond with a success message and updated profile
    return res.json({
      message: "Profile updated",
      profile: profile_to_update, // Optional: send updated profile back
    });
  } catch (error) {
    // Handle any errors that may occur
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsersProfile = async (req, res) => {
  try {
    const Profile = await profile
      .find()
      .populate("userId", "name username email profilePicture");
    return res.json({ Profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const User = await user.findOne({ token: token });
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await user.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "connection User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "request already send" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.json({ message: "request send" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const User = await user.findOne({ token: token });
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userid: User._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  try {
    const User = await user.findOne({ token });

    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: User._id,
    }).populate("userId", "name username email profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const User = await user.findOne({ token });

    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Request Updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
