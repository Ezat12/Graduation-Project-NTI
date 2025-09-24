const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectionDB = require("./config/connectionDB");
const usersRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const ApiError = require("./utils/apiError");

app.use(express.json());
app.use(cors());

dotenv.config();

// Connection DB
connectionDB();

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);

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
