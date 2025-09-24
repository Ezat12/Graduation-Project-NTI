const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const categoryRoutes = require("./routes/category.routes");
const errorHandler = require("./utils/errorHandler");
app.use(express.json());
app.use(cors());
app.use("/categories", categoryRoutes);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`server is ready on port ${port}`);
});
