// // --------------------------- Need to Restructure --------
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/tmp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = { storage, upload}
