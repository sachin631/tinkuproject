const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter name is mandatory"],
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  email: {
    type: String,
    required: [true, "Enter name is mandatory"],
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  passWord: {
    type: String,
    required: true,
  },
  rePassword: {
    type: String,
    required: true,
  },
  // avatar: {
  //   public_id: {
  //     type: String,
  //     required: true,
  //   },
  //   url: {
  //     type: String,
  //     required: true,
  //   },
  // },
  avatar:{
    type:String
  },
  role:{
    type:String,
    default:"user"
  },
  resetPassWordToken:String,

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  passWordResetToken:{
      type:String
  },
  cart: [],
});

//password hashing

userSchema.pre("save", async function (next) {
  if (this.isModified("passWord")) {
    this.passWord = await bcryptjs.hash(this.passWord, 12);
    this.rePassword = await bcryptjs.hash(this.rePassword, 12);
  }
  next();
});

//generate token for user
userSchema.methods.tokenGeneration = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.secretKey);
  this.tokens = this.tokens.concat({ token: token });
  this.save();
  return token;
};

//RegisterUserModel
const userModel = new mongoose.model(
  "registerusers",
  userSchema
);

module.exports = userModel;