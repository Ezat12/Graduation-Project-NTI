const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const studentCourseRoutes = require("./routes/studentCourse.route");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/studentCourse", studentCourseRoutes);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`server is ready on port ${port}`);
});
