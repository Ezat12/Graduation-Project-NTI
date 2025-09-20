const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

app.use(express.json());
app.use(cors());

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`server is ready on port ${port}`);
});
