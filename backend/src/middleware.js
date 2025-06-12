const ExpressError = require("./utils/expressError.js");
const { StatusCodes } = require("http-status-codes");
const User = require("./models/user.js");
const Post = require("./models/post.js");
const Comment = require("./models/comment.js");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errMsg, StatusCodes.BAD_REQUEST);
  }
  next();
};
 
// const validateTokenAndFindUser = async (req, res, next) => {
//   try {
//     const token = req.body?.token || req.query?.token;
//     console.log(token)
    
//     if (!token) {
//       return next(
//         new ExpressError("Token is missing",  StatusCodes.BAD_REQUEST)
//       );
//     }

//     const foundUser = await User.findOne({ token });

//     if (!foundUser) {
//       return next(
//         new ExpressError("User not authenticated", StatusCodes.UNAUTHORIZED)
//       );
//     }

//     req.user = foundUser;
//     next();
//   } catch (error) {
//     next(
//       new ExpressError(
//         "Internal Server Error",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       )
//     );
//   }
// };

const validateTokenAndFindUser = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.body?.token) {
      token = req.body.token;
    } else if (req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      return next(new ExpressError("Token is missing", StatusCodes.BAD_REQUEST));
    }

    const foundUser = await User.findOne({ token });

    if (!foundUser) {
      return next(new ExpressError("User not authenticated", StatusCodes.UNAUTHORIZED));
    }

    req.user = foundUser;
    next();
  } catch (error) {
    next(new ExpressError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};


const owner = async (req, res, next) => {
  try {
    const foundUser = req.user;
    const { id } = req.params;  

    const post = await Post.findById(id);
    if (!post) {
      return next(new ExpressError("Post not found", StatusCodes.NOT_FOUND));
    }

    if (post.userId.toString() !== foundUser._id.toString()) {
      return next(new ExpressError("You're not the owner of this post", StatusCodes.UNAUTHORIZED));
    }

    next();

  } catch (error) {
    next(
      new ExpressError(
        "Internal Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};


const commentOwner = async (req, res, next) => {
  try {
    const foundUser = req.user;
    const { commentId } = req.params;

    const existComment = await Comment.findById(commentId);
    if (!existComment) {
      return next(new ExpressError("Comment not found", StatusCodes.NOT_FOUND));
    }

    if (existComment.userId.toString() !== foundUser._id.toString()) {
      return next(new ExpressError("You're not the owner of this comment", StatusCodes.UNAUTHORIZED));
    }

    next();

  } catch (error) {
    next(new ExpressError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const profileOwner = async (req, res, next) => {
  try {
    const foundUser = req.user;
   

    let userProfile = await Profile.findOne({ userId: foundUser._id });
      if (!userProfile) {
        return next(new ExpressError("Profile not found", StatusCodes.NOT_FOUND));
      }

    next();

  } catch (error) {
    next(new ExpressError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR));
  }
};



module.exports = { validate, validateTokenAndFindUser, owner,commentOwner, profileOwner };
