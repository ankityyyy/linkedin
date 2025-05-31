const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



// dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true, // Ensures HTTPS is used
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkdin", // Ensure correct folder name
    format: async (req, file) => "png", // Default format
    allowed_formats: ["png", "jpg", "jpeg"], // Ensures correct allowed_formats key
  },
});

module.exports={ cloudinary, storage };
