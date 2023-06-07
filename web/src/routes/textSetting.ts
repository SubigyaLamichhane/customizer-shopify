import express from "express";
const textSettingRouter = express.Router();
import upload from "../config/uploadFile.js";
import {
    createTextFontColor,
    getTextFontColors,
    deleteTextFontColorById,
    createTextOutlineColor,
    getTextOutlineColors,
    deleteTextOutlineColorById,
    createTextFont,
    getTextFontList,
    deleteTextFontById,
    createSubTextFontById,
    getTextSubFontListById,
    deleteTextSubFontById,
    // createTextSetting,
    // getTextSetting,
    // deleteTextSettingById
} from "../controllers/textSetting.js";

textSettingRouter.post("/create-text-font-color", createTextFontColor);
textSettingRouter.get("/get-text-font-colors", getTextFontColors);
textSettingRouter.delete("/delete-text-font-color/:id", deleteTextFontColorById);

textSettingRouter.post("/create-text-outline-color", createTextOutlineColor);
textSettingRouter.get("/get-text-outline-colors", getTextOutlineColors);
textSettingRouter.delete("/delete-text-outline-color/:id", deleteTextOutlineColorById);

textSettingRouter.post("/create-text-font", createTextFont);
textSettingRouter.get("/get-text-font-list", getTextFontList);
textSettingRouter.delete("/delete-text-font/:id", deleteTextFontById);
textSettingRouter.post("/create-sub-text-font/:font_id", upload.single('file'), createSubTextFontById);
textSettingRouter.get("/get-text-sub-font-list/:id", getTextSubFontListById);
textSettingRouter.delete("/delete-text-sub-font/:id", deleteTextSubFontById);

// textSettingRouter.get("/create-text-setting", createTextSetting);
// textSettingRouter.get("/get-text-setting", getTextSetting);
// textSettingRouter.get("/delete-text-setting/:id", deleteTextSettingById);

export default textSettingRouter;