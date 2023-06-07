// upload image
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/frontend/assets/public/uploads/')); // local environment
        // cb(null, path.join(__dirname, '/web/frontend/dist/assets/')); // production environment
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

export default upload;