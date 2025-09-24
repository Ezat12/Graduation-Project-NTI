const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
<<<<<<< HEAD
const dotenv = require("dotenv");
const connectionDB = require("./config/connectionDB");
const usersRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const reviewRoutes = require("./routes/review.routes");
const ApiError = require("./utils/apiError");

=======
const categoryRoutes = require("./routes/category.routes");
const errorHandler = require("./utils/errorHandler");
>>>>>>> feature-branch
app.use(express.json());
app.use(cors());
app.use("/categories", categoryRoutes);

// Connection DB
connectionDB();

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);
app.use("/reviews", reviewRoutes);

app.use((req, res, next) => {
  next(new ApiError("Route is not success", 400));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
});


const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`server is ready on port ${port}`);
});
