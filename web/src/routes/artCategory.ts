import express from "express";
const artCategoryRouter = express.Router();
import upload from "../config/uploadFile.js";
import {
    getArtCategoryList,
    createArtCategory,
    getArtCategoryById,
    createArtSubCategoryByArtId,
    getArtSubCategoryByIdAndSubId,
    getArtSubCategorySubList,
    createArtSubCategoryListBySubCategoryId,
    getArtSubCategorySubListById,
    createArtSubCategorySubListBySubCategoryListId,
    deleteArtCategoryById,
    deleteArtSubCategoryById,
    deleteArtSubCategoryListById,
    deleteArtSubCategorySubListId
} from "../controllers/artCategory.js";

/**
 * API for section (Art Category Section)
 */
artCategoryRouter.get("/get-art-category-list", getArtCategoryList);
artCategoryRouter.get("/get-art-category/:id", getArtCategoryById);
artCategoryRouter.post("/create-art-category", upload.single('background_image'), createArtCategory);
artCategoryRouter.post("/create-art-sub-category/:art_category_id", createArtSubCategoryByArtId);
artCategoryRouter.get("/get-art-sub-category/:category_id/:sub_category_id", getArtSubCategoryByIdAndSubId);
artCategoryRouter.get("/get-art-sub-category-sub-list/:category_id/:sub_category_id/:sub_category_list_id", getArtSubCategorySubList);
artCategoryRouter.post("/create-art-sub-category-list/:art_sub_category_id", upload.array("images"), createArtSubCategoryListBySubCategoryId);
artCategoryRouter.get("/get-art-sub-category-sub-list/:id", getArtSubCategorySubListById);
artCategoryRouter.post("/create-art-sub-category-sub-list/:art_sub_category_list_id", upload.array('images'), createArtSubCategorySubListBySubCategoryListId);
artCategoryRouter.delete("/delete-art-category/:id", deleteArtCategoryById);
artCategoryRouter.delete("/delete-art-sub-category/:id", deleteArtSubCategoryById);
artCategoryRouter.delete("/delete-art-sub-category-list/:id", deleteArtSubCategoryListById);
artCategoryRouter.delete("/delete-art-sub-category-sub-list/:id", deleteArtSubCategorySubListId);

export default artCategoryRouter;
