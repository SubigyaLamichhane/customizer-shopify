import { Request, Response } from "express";
import { mysqlConnection, queryPromise } from "../config/mySqlConnection.js";
import gm from "gm";
import { rejects } from "assert";
import shopify from "../../shopify.js";
import axios from "axios";
import { writeFile } from "fs";
import dotenv from "dotenv";
dotenv.config();
// const FILE_PATH = "http://staging.whattocookai.com/api/uploads/public/uploads/";
const FILE_PATH = `${process.env.APP_URL}${process.env.FILE_UPLOAD_PATH}`;

// Get art category list for front end side
const getArtCategoryList = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let query: string = `SELECT * FROM art_category WHERE session_id='${shop_url}' OR session_id IS NULL`;
        mysqlConnection.query(query, function (err: any, result: any) {
            if (err) throw err
            res.status(201).send({
                "status": true,
                "message": "Data fetched!",
                "data": result
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get art category by id for front end side
const getArtCategoryById = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let query_1: string = `SELECT * FROM art_category WHERE id=${req.params.id} AND session_id='${shop_url}' LIMIT 1`;
        var data: any = [];
        mysqlConnection.query(query_1, function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                let query_2: string = `SELECT * FROM art_sub_category WHERE art_category_id=${req.params.id}`;
                data.push(result_1[0]);
                mysqlConnection.query(query_2, function (err: any, result_2: any) {
                    if (err) throw err;
                    if (result_2.length > 0) {
                        data[0].sub_category = result_2;
                    }
                    res.status(200).send({
                        "status": true,
                        "message": "Data fetch!",
                        "data": data
                    });
                });
            } else {
                res.status(404).send({
                    "status": false,
                    "message": `Invalid art category id ${req.params.id}`,
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get art sub category by id's (category_id/sub_category_id) for front end side
const getArtSubCategory = async (req: Request, res: Response) => {
    try {
        let query_1: string = `SELECT * FROM art_category WHERE id=${req.params.category_id} LIMIT 1`;
        var data: any = [];
        mysqlConnection.query(query_1, function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                data.push(result_1[0]);
                let query_2: string = `SELECT * FROM art_sub_category WHERE id=${req.params.sub_category_id}  LIMIT 1`;
                mysqlConnection.query(query_2, function (err: any, result_2: any) {
                    if (err) throw err;
                    if (result_2.length > 0) {
                        data[0].sub_category = result_2;
                        let query_3: string = `SELECT * FROM art_sub_category_list WHERE art_sub_category_id=${req.params.sub_category_id}`;
                        mysqlConnection.query(query_3, function (err: any, result_3: any) {
                            if (err) throw err;
                            if (result_3.length > 0) {
                                data[0].sub_category[0].sub_category_list = result_3;
                            }
                            res.status(200).send({
                                "status": true,
                                "message": "Data fetch",
                                "data": data
                            });
                        });
                    } else {
                        res.status(404).send({
                            "status": false,
                            "message": `Invalid art sub category id ${req.params.sub_category_id}`,
                            "data": [],
                        });
                    }
                });
            } else {
                res.status(404).send({
                    "status": false,
                    "message": `Invalid art category id ${req.params.category_id}`,
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get art sub category sub list by id's (category_id/sub_category_id/sub_category_list_id) for front end side
const getArtSubCategorySubList = async (req: Request, res: Response) => {
    try {
        let query_1: string = `SELECT * FROM art_category WHERE id=${req.params.category_id} LIMIT 1`;
        var data: any = [];
        mysqlConnection.query(query_1, function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                data.push(result_1[0]);
                let query_2: string = `SELECT * FROM art_sub_category WHERE id=${req.params.sub_category_id} LIMIT 1`;
                mysqlConnection.query(query_2, function (err: any, result_2: any) {
                    if (err) throw err;
                    if (result_2.length > 0) {
                        data[0].sub_category = result_2;
                        let query_3: string = `SELECT * FROM art_sub_category_list WHERE art_sub_category_id=${req.params.sub_category_id}`;
                        mysqlConnection.query(query_3, function (err: any, result_3: any) {
                            if (err) throw err;
                            if (result_3.length > 0) {
                                data[0].sub_category[0].sub_category_list = result_3;
                                let query_4: string = `SELECT * FROM art_sub_category_sub_list WHERE art_sub_category_list_id=${req.params.sub_category_list_id}`;
                                mysqlConnection.query(query_4, function (err: any, result_4: any) {
                                    if (err) throw err;
                                    if (result_4.length > 0) {
                                        data[0].sub_category[0].sub_category_list[0].sub_category_sub_list = result_4;
                                    }
                                    res.status(200).send({
                                        "status": true,
                                        "message": "Data fetch",
                                        "data": data
                                    });
                                });
                            } else {
                                res.status(404).send({
                                    "status": false,
                                    "message": `Invalid art sub category sub list id ${req.params.sub_category_id}`,
                                    "data": [],
                                });
                            }
                        });
                    } else {
                        res.status(404).send({
                            "status": false,
                            "message": `Invalid art sub category id ${req.params.sub_category_id}`,
                            "data": [],
                        });
                    }
                });
            } else {
                res.status(404).send({
                    "status": false,
                    "message": `Invalid art category id ${req.params.category_id}`,
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get text font color setting for front end side
const getTextFontColors = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let query: string = `SELECT * FROM text_colors WHERE session_id='${shop_url}'`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": results
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get text font outline color setting for front end side
const getTextOutlineColors = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let query: string = `SELECT * FROM text_outline_colors WHERE session_id='${shop_url}'`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": results
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get text font list for front end side
const getTextFontList = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let query: string = `SELECT * FROM text_fonts WHERE session_id='${shop_url}'`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": results
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get text sub font list for front end side
const getTextSubFontList = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let query: string = `SELECT * FROM text_font_list WHERE font_id='${req.params.id}'`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": results
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get text sub font list for front end side
const convertFile = async (req: Request, res: Response) => {
    try {
        let image: any = await req.file;
        let fileExtension: string = image.filename.split('.').pop();
        let fileName: string = image.filename.replace(fileExtension, "png");
        let destination: string = image.destination;
        if (fileExtension == "pdf" || fileExtension == "PDF"
            || fileExtension == "ai" || fileExtension == "AI"
            || fileExtension == "eps" || fileExtension == "EPS"
            || fileExtension == "jpg" || fileExtension == "JPG"
            || fileExtension == "jpeg" || fileExtension == "JPEG"
            || fileExtension == "psd" || fileExtension == "PSD"
            || fileExtension == "png" || fileExtension == "PNG") {
            gm(image.path).in("-colorspace").in("srgb").write(destination + fileName, function (err: any) {
                if (err) throw err
                res.status(200).send({
                    "status": true,
                    "message": "File converted from " + fileExtension + " to png formate successfully!",
                    "data": FILE_PATH + fileName
                });
            });
        } else {
            res.status(200).send({
                "status": false,
                "message": "Invalid file formate!",
                "data": []
            });
        }
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!" + error,
            "data": []
        });
    }
};

// Get all text fonts by search for front end side
const getAllFonts = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let searchQuery: any = req.query.name;
        let query: string = `SELECT * FROM text_font_list WHERE session_id='${shop_url}'`;
        if (req.query.name) {
            query = `SELECT * FROM text_font_list WHERE session_id='${shop_url}' AND name LIKE '%${searchQuery}%'`;
        }
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": results
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get all art list by search for front end side
const getArtList = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let searchQuery: any = req.query.name;
        let query_1: string = `SELECT * FROM art_category WHERE session_id='${shop_url}' AND name='${searchQuery}'`;
        var data: any = [];
        mysqlConnection.query(query_1, async function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                for (let item_1 of result_1) {
                    let query_2: string = `SELECT * FROM art_sub_category WHERE art_category_id=${item_1.id}`;
                    let result_2 = await queryPromise(query_2);
                    if (result_2.length > 0) {
                        for (let item_2 of result_2) {
                            let query_3: string = `SELECT * FROM art_sub_category_list WHERE art_sub_category_id=${item_2.id}`;
                            let result_3 = await queryPromise(query_3);
                            if (result_3.length > 0) {
                                for (let item_3 of result_3) {
                                    if (item_3.image != null) {
                                        data.push(item_3);
                                    } else {
                                        let query_4: string = `SELECT * FROM art_sub_category_sub_list WHERE art_sub_category_list_id=${item_3.id}`;
                                        let result_4 = await queryPromise(query_4);
                                        if (result_4.length > 0) {
                                            data.push(result_4);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return res.status(200).send({
                    "status": true,
                    "message": "Data fetched!",
                    "data": data
                });
            } else {
                let query_2: string = `SELECT * FROM art_sub_category WHERE session_id='${shop_url}' AND name='${searchQuery}'`;
                let result_2 = await queryPromise(query_2);
                if (result_2.length > 0) {
                    for (let item_2 of result_2) {
                        let query_3: string = `SELECT * FROM art_sub_category_list WHERE art_sub_category_id=${item_2.id}`;
                        let result_3 = await queryPromise(query_3);
                        if (result_3.length > 0) {
                            for (let item_3 of result_3) {
                                if (item_3.image != null) {
                                    data.push(item_3);
                                } else {
                                    let query_4: string = `SELECT * FROM art_sub_category_sub_list WHERE art_sub_category_list_id=${item_3.id}`;
                                    let result_4 = await queryPromise(query_4);
                                    if (result_4.length > 0) {
                                        data.push(result_4);
                                    }
                                }
                            }
                        }
                    }
                    return res.status(200).send({
                        "status": true,
                        "message": "Data fetched!",
                        "data": data
                    });
                } else {
                    let query_3: string = `SELECT * FROM art_sub_category_list WHERE session_id='${shop_url}' AND name='${searchQuery}'`;
                    let result_3 = await queryPromise(query_3);
                    if (result_3.length > 0) {
                        for (let item_3 of result_3) {
                            let query_4: string = `SELECT * FROM art_sub_category_sub_list WHERE art_sub_category_list_id=${item_3.id}`;
                            let result_4 = await queryPromise(query_4);
                            if (result_4.length > 0) {
                                data.push(result_4);
                            }
                        }
                    }
                    return res.status(200).send({
                        "status": true,
                        "message": "Data fetched!",
                        "data": data
                    });
                }
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get product data by product_id front end side
const getProduct = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let productId: any = req.params.id;
        let data: any = [];
        let query: any = `SELECT * FROM shopify_sessions WHERE id='${shop_url}'`
        let result = await queryPromise(query);
        const productData = await shopify.api.rest.Product.find({
            session: result[0],
            id: req.params.id,
        });
        let query_1: string = `SELECT * FROM products WHERE session_id='${shop_url}' AND product_id='${productId}'`;
        let result_1 = await queryPromise(query_1);
        if (result_1.length > 0) {
            data.push(result_1[0]);
            data[0].shopify_product = productData;
            let query_2: string = `SELECT * FROM product_mappings WHERE session_id='${shop_url}' AND product_id='${result_1[0].id}'`;
            let result_2 = await queryPromise(query_2);
            if (result_2.length > 0) {
                data[0].product_map = result_2;
            }
            return res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": data
            });
        }
    } catch (error: any) {
        return res.status(404).send({
            "status": false,
            "message": "Something went wrong!" + error,
            "data": []
        });
    }
};

const handlePhpApi = async (req: Request, res: Response) => {
    try {
        let url: any = req.url;
        url = url.replace("/handlePhpApi?url=", "");
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return res.
            status(200)
            .set("Content-Type", "image/png")
            .send(response.data);
    } catch (error: any) {
        return res.status(500).send({
            "status": false,
            "message": "Error retrieving image!" + error,
            "data": []
        });
    }
};

// Create product variant and add to cart
const addToCart = async (req: Request, res: Response) => {
    try {
        let shop_url: any = req.query.shop_url;
        let productId: any = req.body.product_id;
        let query: any = `SELECT * FROM shopify_sessions WHERE id='${shop_url}'`;
        const result = await queryPromise(query);
        const session = result[0];

        const imageData = req.body.imageData;
        const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
        const fileName = `${Date.now()}.png`;
        const filePath = `public/uploads/${fileName}`;

        // Save the image to the server
        writeFile(filePath, base64Data, 'base64', async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to upload image.' });
            }

            const variant = new shopify.api.rest.Variant({ session: session });
            variant.product_id = productId;
            variant.option1 = `Customizer_${Date.now()}`; // variant name
            variant.price = "1.00";
            await variant.save({
                update: true,
            });
            let variantId: any = variant.id;

            // Added image for the variant
            const image = new shopify.api.rest.Image({ session: session });
            image.product_id = productId;
            image.variant_ids = [variantId];
            image.filename = fileName;
            image.src = `${FILE_PATH}${fileName}`;
            await image.save({
                update: true,
            });

            // Update inventory
            const inventory_level = new shopify.api.rest.InventoryLevel({ session: session });
            await inventory_level.adjust({
                body: { "location_id": 63770296460, "inventory_item_id": 43721372303500, "available_adjustment": 25 },
            });

            return res.status(200).send({
                status: true,
                message: "Variant created successfully!",
                variant: variant,
                // inventory: updatedInventoryLevel,
                image: image,
            });
        });
    } catch (error: any) {
        return res.status(404).send({
            status: false,
            message: "Something went wrong! " + error,
            data: [],
        });
    }
};

export {
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
    getProduct,
    convertFile,
    handlePhpApi,
    addToCart
};
