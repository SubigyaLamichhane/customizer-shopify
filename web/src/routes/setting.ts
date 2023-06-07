import express from "express";
const settingRouter = express.Router();
import {
    getSetting,
    saveSetting,
    deleteSettingById
} from "../controllers/setting.js";

settingRouter.get("/get-setting", getSetting);
settingRouter.post("/save-setting", saveSetting);
settingRouter.delete("/delete-setting/:id", deleteSettingById)

export default settingRouter;