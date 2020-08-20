import multer from "multer";
import fs from "fs";

// --------------------------- Need to Restructure --------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create folder as per product id
    const dir = `./uploads/`;

    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

export default { storage, upload };
