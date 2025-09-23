const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const studentCourseRoutes = require("./routes/studentCourseRoutes");

dotenv.config(); 

const app = express();


app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  ;
});

app.use("/user", studentCourseRoutes); 


mongoose
  .connect("mongodb://127.0.0.1:27017/todo")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => console.log(" Server running on port 3000"));
  })
  .catch((err) => console.log(err));
