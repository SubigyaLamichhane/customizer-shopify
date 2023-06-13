// upload image
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
import dotenv from "dotenv";
dotenv.config();
// const STORAGE_PATH = "/web/public/uploads/";
const STORAGE_PATH = `${process.env.STORAGE_PATH}`;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, STORAGE_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

export default upload;