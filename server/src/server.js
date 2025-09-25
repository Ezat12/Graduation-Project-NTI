const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectionDB = require("./config/connectionDB");
const usersRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const reviewRoutes = require("./routes/review.routes");
const ApiError = require("./utils/apiError");
const categoryRoutes = require("./routes/category.routes");
const studentCourseRoutes = require("./routes/studentCourse.route");
const errorHandler = require("./middleware/errorHandler.middleware");

app.use(express.json());
app.use(cors());
dotenv.config();

// Connection DB
connectionDB();

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/studentCourse", studentCourseRoutes);

app.use((req, res, next) => {
  next(new ApiError("Route is not success", 400));
});

app.use(errorHandler);


const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`server is ready on port ${port}`);
});
