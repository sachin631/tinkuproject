const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.userAuthentication = async (req, res, next) => {
  try {
    console.log("cookie",req.cookies)
    const token = req.cookies.fullStackCookie;
    console.log("Token",token)
    const verifyToken = jwt.verify(token, process.env.secretKey);
    console.log(verifyToken);

    const rootUser = await userModel.findOne({
      _id: verifyToken._id,
    });
    // console.log(rootuser);

    if (!rootUser) { 
      throw new Error("user not found authniticatate.js");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id; 
    next();
  } catch (error) {
    res.status(401).json("error in authenticate.js");
    console.log(error);
  }
};

//i think for admin role 
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.rootUser.role)) {
      next();
    } else {
      throw new Error("Only Admin can access this ");
    }
  };
};
