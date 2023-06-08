import express from "express";
const prodRouter = express.Router();
import upload from "../config/uploadFile.js";
import {
    addProduct,
    getProductList,
    getProductById,
    deleteMapProductId,
    mapProductById,
    deleteProductById
} from "../controllers/product.js";

prodRouter.post("/add-product", addProduct);
prodRouter.get("/get-product-list", getProductList);
prodRouter.get("/get-product/:id", getProductById);
prodRouter.delete("/delete-map-product/:id/:product_id", deleteMapProductId);
prodRouter.post("/map-product/:id", upload.single('image'), mapProductById);
prodRouter.delete("/delete-product/:id", deleteProductById);

export default prodRouter;