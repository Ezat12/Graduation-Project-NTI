const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__filename, "../../uploads");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}.${file.mimetype.split("/")[1]}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage }).fields([
  { name: "file", maxCount: 1 },
  { name: "files", maxCount: 10 },
]);

module.exports = upload;
