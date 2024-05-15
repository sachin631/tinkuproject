// require("dotenv").config();
// const cloudinary = require("cloudinary");
// const express = require("express");
// const app = express();
// require("./DbConnect/connect");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const productRouter = require("./router/productRouter");
// const fileUpload = require("express-fileupload");
// const userRouter = require("./router/userRouter");
// const orderRouter = require("./router/orderRouter");
// const PORT = process.env.PORT || 27017;

// // app.use(cors())
// try {
//   app.use(
//     cors({
//       origin: "http://localhost:3000",
//       credentials: true,
//     })
//   );
//   // app.use((req, res, next) => {
//   //   res.header("Access-Control-Allow-Credentials", "true");
//   //   next();
//   // });   /// this resolve the problem of  cludnary data disapper

//   app.use(express.json({ limit: '10mb' }));

//   app.use("/uploads", express.static("./uploads"));

//   app.use("/files",express.static("./public/files"));
//   app.use(cookieParser());

//   app.use(bodyParser.urlencoded({ extended: true }));
//   // app.use(fileUpload()); //show error

//   // app.use(fileUpload({
//   //   useTempFiles:true
//   // }))  //this code show errror in multer
//   // app.use(bodyParser.urlencoded({extended:true})); // from express.json() or bodyParser use any one to deal with json file

//   //always take router in last
//   app.use(productRouter);
//   app.use(userRouter);
//   app.use(orderRouter);

//   //apply clodinary
//   cloudinary.config({
//     cloud_name: process.env.cloud_name,
//     api_key: process.env.api_key,
//     api_secret: process.env.api_secret,
//   });

//   app.listen(27017, () => {
//     console.log("working");
//   });
// } catch (error) {
//   console.log("something went wrong", error);
// }

require("dotenv").config();
const cloudinary = require("cloudinary");
const express = require("express");
const app = express();
// require("./DbConnect/connect");
const connection=require("./DbConnect/connect");
connection();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const productRouter = require("./router/productRouter");
const fileUpload = require("express-fileupload");
const userRouter = require("./router/userRouter");
const orderRouter = require("./router/orderRouter");
const PORT = process.env.PORT || 27017;

try {
  // app.use(
  //   cors({
  //     origin:
  //       "https://65070a2ea65d6c0007738a7a--precious-tarsier-661a39.netlify.app",
  //     credentials: true, // Allow credentials (cookies, etc.)
  //   })
  // );
  app.use(
        cors({
          origin: "http://localhost:3000",
          credentials: true,
        })
      );
  // Handle preflight (OPTIONS) requests
  app.options("*", cors()); // Enable CORS for all OPTIONS requests

  app.use(express.json({ limit: "10mb" }));

  app.use("/uploads", express.static("./uploads"));

  // app.use("/files",express.static("./public/files"));
  app.use(cookieParser());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());

  //always take router in last
  app.use(productRouter);
  app.use(userRouter);
  app.use(orderRouter);

  //apply clodinary
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });

  app.listen(PORT, () => {
    console.log("working");
  });
} catch (error) {
  console.log("something went wrong", error);
}
