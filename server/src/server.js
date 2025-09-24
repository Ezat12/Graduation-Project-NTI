const express = require("express");
const mongoose=require("mongoose")
const app = express();
const cors = require("cors");
const categoryRoutes=require("./routes/categoryRoutes")
const errorHandler =require("./utils/errorHandler")
const config =require("./config/config")
app.use(express.json());
app.use(cors());
app.use("/categories",categoryRoutes)
app.use(errorHandler)

mongoose.connect(config.mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
  })
  .catch((err) => console.error("DB connection error:", err));
