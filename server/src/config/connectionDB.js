const mongoose = require("mongoose");

// const connectionDB = () => {
//   mongoose
//     .connect(process.env.DB_URI)
//     .then(() => {
//       console.log("Data base connection");
//     })
//     .catch((e) => {
//       console.log(e);
//       console.log("Error data base");
//     });
// };

const connectionDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/graduationDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


module.exports = connectionDB;
