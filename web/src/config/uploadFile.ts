// upload image
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
import dotenv from "dotenv";
dotenv.config();
const STORAGE_PATH = `${process.env.STORAGE_PATH}`;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, STORAGE_PATH)); // local environment
        // cb(null, path.join(__dirname, STORAGE_PATH)); // production environment

        // cb(null, path.join(__dirname, '/frontend/assets/public/uploads/')); // local environment
        // cb(null, path.join(__dirname, '/web/frontend/dist/assets/')); // production environment
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

export default upload;