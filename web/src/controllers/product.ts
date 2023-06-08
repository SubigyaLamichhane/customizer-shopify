import { Request, Response } from "express";
import mysqlConnection from "../config/mySqlConnection.js";
const FILE_PATH = process.env.HOST + "/assets/public/uploads/";

// Add product
const addProduct = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let productData: any = [];
        let products: any = req.body.products;
        let query: string = "INSERT INTO products (session_id, product_id, title, image, product_color) VALUES ?";
        products.forEach((item: any, itemKey: any) => {
            productData[itemKey] = [
                session_id,
                item.product_id,
                item.product_title,
                item.product_image,
                JSON.stringify(item.product_color)
            ];
        });
        mysqlConnection.query(query, [productData], function (error: any, result: any, fields: any) {
            if (error) throw error;
            if (result.affectedRows > 0) {
                res.status(201).send({
                    "status": true,
                    "message": "Product Added!",
                    "data": result
                });
            } else {
                res.status(500).send({
                    "status": true,
                    "message": 'Something went wrong!',
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};


// Get product list
const getProductList = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        mysqlConnection.query('select * from products WHERE ?', {
            session_id: session_id
        }, function (err: any, result: any) {
            if (err) throw err
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": result
            });
        });
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get product by id
const getProductById = async (req: Request, res: Response) => {
    try {
        let query_1: string = `SELECT * FROM products WHERE id=${req.params.id} LIMIT 1`;
        var data: any = [];
        mysqlConnection.query(query_1, function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                let query_2: string = `SELECT * FROM product_mappings WHERE product_id=${req.params.id}`;
                data.push(result_1[0]);
                mysqlConnection.query(query_2, function (err: any, result_2: any) {
                    if (err) throw err;
                    if (result_2.length > 0) {
                        data[0].product_map = result_2;
                    }
                    res.status(200).send({
                        "status": true,
                        "message": "Data fetchedss",
                        "data": data
                    });
                });
            } else {
                res.status(404).send({
                    "status": false,
                    "message": `Invalid product id ${req.params.id}`,
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

// let query_1 = `SELECT COUNT(id)  AS count FROM product_mappings WHERE product_id=122`
// mysqlConnection.query(query_1, function (error: any, result_1: any) {
//     if (result_1[0].count == 0) {

//     }
// });

// Delete map product by id
const deleteMapProductId = async (req: Request, res: Response) => {
    try {
        let query: string = `DELETE FROM product_mappings WHERE id=${req.params.id}`;
        console.log('query', query)
        mysqlConnection.query(query, function (error: any, results: any) {
            if (error) throw error;
            if (results.affectedRows > 0) {
                let query_1 = `SELECT COUNT(id)  AS count FROM product_mappings WHERE product_id=${req.params.product_id}`
                mysqlConnection.query(query_1, function (error: any, result_1: any) {
                    if (result_1[0].count == 0) {
                        let query_2: any = `UPDATE products SET is_mapped = 0 WHERE id = ${req.params.product_id}`
                        mysqlConnection.query(query_2, function (error: any, result_2: any) {
                            if (error) throw error;
                            res.status(200).send({
                                "status": true,
                                "message": "Deleted success!",
                                "data": result_2
                            });
                        });
                    } else {
                        res.status(200).send({
                            "status": true,
                            "message": "Deleted success!",
                        });
                    }
                });
            } else {
                res.status(404).send({
                    "status": true,
                    "message": `Invalid product map id ${req.params.id}`,
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Map product by id
const mapProductById = async (req: Request, res: Response) => {
    try {
        let image: any = await req.file;
        let uploadedFilePath: any = image ? FILE_PATH + image.filename : req.body.image;
        let session_id: string = res.locals.shopify.session.id;
        let is_mapped: number = 1;
        let look_name: string = req.body.look_name;
        let crop: string = req.body.crop;
        let query_1: string = `SELECT * FROM products WHERE id=${req.params.id}`;

        mysqlConnection.query(query_1, function (error: any, result_1: any, fields: any) {
            if (error) throw error;
            if (result_1.length > 0) {
                let query_2: string = `UPDATE products SET 
                is_mapped = ? WHERE id='${req.params.id}'`;
                let updatedProdSettingData = [
                    is_mapped,
                ];
                mysqlConnection.query(query_2, updatedProdSettingData, function (error, result_2, fields) {
                    if (error) throw error;
                    mysqlConnection.query('INSERT INTO product_mappings SET ?', {
                        session_id: session_id,
                        product_id: req.params.id,
                        look_name: look_name,
                        image: uploadedFilePath,
                        crop: crop,
                    }, function (error: any, result_3: any, fields: any) {
                        if (error) throw error;
                        res.status(201).send({
                            "status": true,
                            "message": "Saved product map!",
                            "data": result_3,
                            "uploaded_file_path": uploadedFilePath
                        });
                    });
                });
            } else {
                res.status(404).send({
                    "status": false,
                    "message": `Invalid product id ${req.params.id}`,
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!" + error,
            "data": []
        });
    }
};

// Delete product by id
const deleteProductById = async (req: Request, res: Response) => {
    try {
        let query: string = `DELETE FROM products WHERE id=${req.params.id}`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            if (results.affectedRows > 0) {
                res.status(200).send({
                    "status": true,
                    "message": "Deleted success!",
                    "data": results
                });
            } else {
                res.status(404).send({
                    "status": true,
                    "message": `Invalid product id ${req.params.id}`,
                    "data": [],
                });
            }
        });
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};


export {
    addProduct,
    getProductList,
    getProductById,
    deleteMapProductId,
    mapProductById,
    deleteProductById
};