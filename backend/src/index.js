const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("../src/routes/user.js");
const ExpressError = require("./utils/expressError.js");
// const httpStatus = require("http-status");
const { StatusCodes } = require("http-status-codes");
const profileRoutes=require("./routes/profile.js")
const postRoutes=require("./routes/post.js");
const cors=require('cors')
const path = require("path");
const dotenv=require("dotenv");
dotenv.config();
const dbUrl = process.env.ATLASDB_URL;




if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}




// MongoDB connection
const url = "mongodb://127.0.0.1:27017/linkedin";
async function main() {
  try { 
    await mongoose.connect(dbUrl);
    console.log("Connection successful");
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
  }
}
main();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://linkedin-frontend-hi4w.onrender.com","http://localhost:5173"], 
    methods: "GET, POST, PUT,PATCH, DELETE",
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});


// Routes
app.use("/", userRoutes);
app.use("/users", profileRoutes);
app.use("/Post", postRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});


// app.use((req, res, next) => {
//   if (!req.route) {
//     return next(new ExpressError("Page not found",httpStatus.NOT_FOUND));
//   }
//   next();
// }); 

// app.use((req, res, next) => {
//   next(new ExpressError("Page not found",  StatusCodes.NOT_FOUND));
// });


app.use((req, res, next) => {
  next(new ExpressError("Page not found", StatusCodes.NOT_FOUND));
}); 



  app.use((err, req, res, next) => {
    console.log("ERROR:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({ message });
  });
  



app.listen(8080, () => {
  console.log("app is listen on port no :8080");
});
