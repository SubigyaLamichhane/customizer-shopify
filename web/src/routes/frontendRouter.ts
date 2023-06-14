import express from "express";
const frontendRouter = express.Router();
import upload from "../config/uploadFile.js";
import { 
    getArtCategoryList,
    getArtCategoryById,
    getArtSubCategory,
    getArtSubCategorySubList,
    getTextFontColors,
    getTextOutlineColors,
    getTextFontList,
    getTextSubFontList,
    getAllFonts,
    getArtList,
    convertFile
} from "../controllers/frontend.js";

/**
 * API for section (Art Category Section)
 */
frontendRouter.get("/get-art-category-list", getArtCategoryList);
frontendRouter.get("/get-art-category/:id", getArtCategoryById);
frontendRouter.get("/get-art-sub-category/:category_id/:sub_category_id", getArtSubCategory);
frontendRouter.get("/get-art-sub-category-sub-list/:category_id/:sub_category_id/:sub_category_list_id", getArtSubCategorySubList);
frontendRouter.get("/get-art-list", getArtList);

/**
 * API for section (Text Color Section)
 */
frontendRouter.get("/get-text-font-colors", getTextFontColors);
frontendRouter.get("/get-text-outline-colors", getTextOutlineColors);

/**
 * API for section (Text Font Style Section)
 */
frontendRouter.get("/get-text-font-list", getTextFontList);
frontendRouter.get("/get-text-sub-font-list/:id", getTextSubFontList);
frontendRouter.get("/get-all-fonts", getAllFonts);

// Convert pdf/ai/eps/jpg/jpeg/psd file into png formate
frontendRouter.post("/convert-file", upload.single('image'), convertFile);

export default frontendRouter;