const mongoose = require("mongoose");

const connectionDB = () => {
  mongoose
    .connect(process.env.URI_DB)
    .then(() => {
      console.log("Data base connection");
    })
    .catch((e) => {
      console.log(e);
      console.log("Error data base");
    });
};


module.exports = connectionDB;
