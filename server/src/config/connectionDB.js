const mongoose = require("mongoose");

const connectionDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Data base connection");
    })
    .catch((e) => {
      console.log(e);
      console.log("Error data base");
    });
};


module.exports = connectionDB;
