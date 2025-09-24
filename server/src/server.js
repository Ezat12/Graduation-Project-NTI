const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const reviewRoutes = require("./routes/review.routes");

app.use(express.json());
app.use(cors());

dotenv.config();

app.use("/reviews", reviewRoutes);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`server is ready on port ${port}`);
});
