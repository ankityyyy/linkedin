// import dotenv from "dotenv";
// dotenv.config();

// const PORT = process.env.PORT || 3002;
// const uri = process.env.ATLASDB_URL;

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import bodyParser from "body-parser";
// import path from "path";
// import userRoutes from "./routes/user.routes.js";
// import postRoutes from "./routes/posts.routes.js";
// import { ExpressError } from "./utils/ExpressError.js";
// import test from "./views/test.ejs";

// const app = express();
// app.use(cors());

// app.use(bodyParser.json());
// app.use(express.json());

// app.set("view engine", "ejs");

// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("uploads"));
// // const imagePath = path.join(__dirname, "uploads");

// app.use("/posts", postRoutes);
// app.use("/", userRoutes);

// app.get("/ff", (req, res) => {
//   res.send("hello");
// });

// // app.use("*", (req, res, next) => {
// //   next(new ExpressError(404, "page not found"));
// // });

// // app.use((err, req, res, next) => {
// //   let { statusCode = 500, message = "something went wrongs" } = err;
// // console.log(err);

// // return res.status(statusCode).json({ message: err.message });
// // res.status(statusCode).send(message);
// // });

// app.listen(PORT, () => {
//   console.log("listen on port no 3002");
//   mongoose.connect(uri);
//   console.log("data base is connect");
// });

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3002;
const uri = process.env.ATLASDB_URL;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url"; // Needed to handle __dirname with ESM

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";
import { ExpressError } from "./utils/ExpressError.js";

// Handling __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views folder is set

app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads")); // Serving static files from the 'uploads' folder

// Routes
app.use("/", postRoutes);
app.use("/", userRoutes);

app.get("/ff", (req, res) => {
  res.send("hello");
});

// Test rendering an EJS file
app.get("/test", (req, res) => {
  res.render("test"); // This will look for 'test.ejs' in the views folder
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);
  return res.status(statusCode).json({ message: err.message });
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });
});
