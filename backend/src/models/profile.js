const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
     school: { type: String, default: "" },
     degree: { type: String, default: "" },
     fieldOfStudy: { type: String, default: "" },
});

const education = mongoose.model("Education", educationSchema);
module.exports = education;

const workSchema = new mongoose.Schema({
     company: { type: String, default: "" },
     role: { type: String, default: "" },
     duration: { type: String, default: "" },
     description: { type: String, default: "" },
});

const work = mongoose.model("Work", workSchema);
module.exports = work;

const profileSchema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     bio: {
           type: String,
            default: "" 
          },
     currentPost: {
          type: String,
          default: "",
     },
     pastWork:{
          type:[workSchema],
          default:[],
     },
     education:{
          type:[educationSchema],
          default:[],
     },
     year:{
type:Number,
 default: "",

     }
});

const profile=mongoose.model("Profile",profileSchema);

module.exports=profile;
