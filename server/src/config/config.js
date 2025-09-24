require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/graduationDB",
  port: process.env.PORT || 3000,
};