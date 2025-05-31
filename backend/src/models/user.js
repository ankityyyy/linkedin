const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
     username: {
          type: String,
          required: true,
          unique:true,
        },
        password: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        number: {
          type: Number,
          required: true,
        },
        active: {
          type: Boolean,
          default: true,
        },
        // profilePicture: {
        //   filename: String,
        //       url: String,
        //       default: "default.jpg"
        // },
      
      
        profilePicture: {
          filename: { type: String }, 
          url: { type: String, default: "uploads/default.jpg" }
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        token: {
          type: String,
          default:''
        },
})

const user=mongoose.model("User",userSchema);

module.exports=user;