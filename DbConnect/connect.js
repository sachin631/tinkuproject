const mongoose = require("mongoose");

// (async()=>{
//     try{
//         mongoose.set('strictQuery',false);//warning show by monoose in console
//         module.exports = await mongoose.connect(process.env.DataBaseName, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//           });
//           console.log("BB connected")

//     }catch(error){
//         console.log(error);
//     }
// })()
async function sachin() {
  try {
    mongoose.set("strictQuery", false); //warning show by monoose in console
    module.exports = await mongoose.connect(process.env.DataBaseName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("BB connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports=sachin;
