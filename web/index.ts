// @ts-check
import { join } from "path";
import { readFileSync, writeFile } from "fs";
import express, { Request, Response, NextFunction, Express } from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
// import { MySqlConnection } from "@shopify/shopify-app-session-storage-mysql/build/ts/mysql-connection.js";
import { MySQLSessionStorage } from '@shopify/shopify-app-session-storage-mysql';
// import connection from "./mySqlConnection.js";

import mysqlConnection from "./mySqlConnection.js";

// use body-parser for fetch request body
import bodyParser from "body-parser";
import { shopifyApp } from "@shopify/shopify-app-express";

import { Session } from '@shopify/shopify-api';
import { fromPath } from "pdf2pic";
import gm from "gm";
const gmSubClass = gm.subClass({ imageMagick: true });

// upload image
import multer from "multer";
import path from "path";
import { encode } from "punycode";
const __dirname = path.resolve();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //    cb(null, 'uploads');
        cb(null, path.join(__dirname, '/public/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

console.log(process.env.BACKEND_PORT, 'hello', process.env.PORT);

const PORT = process.env.BACKEND_PORT || process.env.PORT;

const STATIC_PATH =
    process.env.NODE_ENV === "production"
        ? `${process.cwd()}/frontend/dist`
        : `${process.cwd()}/frontend/`;

const app: Express = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot()
);
app.post(
    shopify.config.webhooks.path,
    // @ts-ignore
    shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use(express.json());
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, 'public')));
// ...................................
// Front end api's.

// Convert pdf/ai/eps/jpg/jpeg/psd file into png formate
app.post("/api/convert-file", upload.single('image'), async (req: Request, res: Response) => {
    let image: any = await req.file;
    let fileExtension: string = image.filename.split('.').pop();
    let fileName: string = image.filename.replace(fileExtension, "png");
    let destination: string = image.destination;
    if (fileExtension == "pdf" || fileExtension == "PDF"
        || fileExtension == "ai" || fileExtension == "AI"
        || fileExtension == "eps" || fileExtension == "EPS"
        || fileExtension == "jpg" || fileExtension == "JPG"
        || fileExtension == "jpeg" || fileExtension == "JPEG"
        || fileExtension == "psd" || fileExtension == "PSD") {
        gm(image.path).in("-colorspace").in("srgb").write(destination + fileName, function (err: any) {
            if (err) throw err
            res.status(200).send({
                "status": true,
                "message": "File converted from " + fileExtension + " to png formate successfully!",
                "data": destination + fileName
            });
        });
    } else {
        res.status(200).send({
            "status": false,
            "message": "Invalid file formate!",
            "data": []
        });
    }
});

// api for testing
app.get("/api/test", (req: Request, res: Response) => {
    res.status(200).send({
        "status": true,
        "message": 'This is test api!',
        "data": [],
    });
});

// ...................................

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

// app.use(express.json());
// app.use(bodyParser.json());

app.get("/api/products/count", async (_req: Request, res: Response) => {
    const countData = await shopify.api.rest.Product.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
});

app.get("/api/products/create", async (_req: Request, res: Response) => {
    let status: number = 200;
    let error: any = null;

    try {
        await productCreator(res.locals.shopify.session);
    } catch (e: any) {
        console.log(`Failed to process products/create: ${e.message}`);
        status = 500;
        error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
});

// ...................................

// Get art category list
app.get("/api/get-art-category-list", (req: Request, res: Response) => {
    let query: string = `SELECT * FROM art_category WHERE session_id='${res.locals.shopify.session.id}'`;
    mysqlConnection.query(query, function (err: any, result: any) {
        if (err) throw err
        res.status(201).send({
            "status": true,
            "message": "Data fetched!",
            "data": result
        });
    });
});

// Create art category
app.post("/api/create-art-category", async (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    let name: string = req.body.name;
    let background_image: string = req.body.background_image;
    mysqlConnection.query('INSERT INTO art_category SET ?', {
        session_id: session_id,
        name: name,
        background_image: background_image
    }, function (error: any, results: any, fields: any) {
        if (error) throw error;
        let artCategoryId: number = results.insertId;
        res.status(201).send({
            "status": true,
            "message": "Created art category!",
            "data": results
        });
    });
});

// Create art sub category
app.post("/api/create-art-sub-category/:art_category_id", (req: Request, res: Response) => {
    let art_category_id: any = req.params.art_category_id;
    let name: string = req.body.name;
    let query: string = `SELECT * FROM art_category WHERE id=${art_category_id}`;
    mysqlConnection.query(query, function (error: any, results_1: any, fields: any) {
        if (error) throw error;
        if (results_1.length > 0) {
            mysqlConnection.query('INSERT INTO art_sub_category SET ?', {
                art_category_id: art_category_id,
                name: req.body.name,
            }, function (error: any, results: any, fields: any) {
                if (error) throw error;
                res.status(201).send({
                    "status": true,
                    "message": "Created art sub category!",
                    "data": results
                });
            });
        } else {
            res.status(404).send({
                "status": true,
                "message": `Invalid art category id ${req.params.art_category_id}`,
                "data": [],
            });
        }
    });
});

// Create art sub category list
app.post("/api/create-art-sub-category-list/:art_sub_category_id", (req: Request, res: Response) => {
    let art_sub_category_id: number = req.body.art_sub_category_id;
    let name: string = req.body.name;
    let image_src: string = req.body.image_src;
    let query: string = `SELECT * FROM art_sub_category WHERE id=${req.params.art_sub_category_id}`;
    mysqlConnection.query(query, function (error: any, results_1: any, fields: any) {
        if (error) throw error;
        if (results_1.length > 0) {
            mysqlConnection.query('INSERT INTO art_sub_category_list SET ?', {
                art_sub_category_id: art_sub_category_id,
                name: name,
                image_src: image_src
            }, function (error: any, results: any, fields: any) {
                if (error) throw error;
                res.status(201).send({
                    "status": true,
                    "message": "Created art category list!",
                    "data": results
                });
            });
        } else {
            res.status(404).send({
                "status": true,
                "message": `Invalid art sub category id ${req.params.art_sub_category_id}`,
                "data": [],
            });
        }
    });
});

// Create art sub category list sub
app.post("/api/create-art-sub-category-sub-list/:art_sub_category_list_id", (req: Request, res: Response) => {
    let art_sub_category_list_id: number = req.body.art_sub_category_list_id;
    let image_src: string = req.body.image_src;
    let query: string = `SELECT * FROM art_sub_category_list WHERE id=${req.params.art_sub_category_list_id}`;
    mysqlConnection.query(query, function (error, results_1, fields) {
        if (error) throw error;
        if (results_1.length > 0) {
            mysqlConnection.query('INSERT INTO art_sub_category_sub_list SET ?', {
                art_sub_category_list_id: art_sub_category_list_id,
                image_src: image_src
            }, function (error: any, results: any, fields: any) {
                if (error) throw error;
                res.status(201).send({
                    "status": true,
                    "message": "Created art sub category list!",
                    "data": results
                });
            });
        } else {
            res.status(404).send({
                "status": true,
                "message": `Invalid art sub category list id! ${req.params.art_sub_category_list_id}`,
                "data": [],
            });
        }
    });
});

// Delete art category by id
app.delete("/api/delete-art-category/:id", (req: Request, res: Response) => {
    let query: string = `DELETE FROM art_category WHERE id=${req.params.id}`;
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
                "message": `Invalid art category id ${req.params.id}`,
                "data": [],
            });
        }
    });
});

// Delete art sub category by id
app.delete("/api/delete-art-sub-category/:id", (req: Request, res: Response) => {
    let query: string = `DELETE FROM art_sub_category WHERE id=${req.params.id}`;
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
                "message": `Invalid art sub category id ${req.params.id}`,
                "data": [],
            });
        }
    });
});

// Delete art sub category list by id
app.delete("/api/delete-art-sub-category-list/:id", (req: Request, res: Response) => {
    let query: string = `DELETE FROM art_sub_category_list WHERE id=${req.params.id}`;
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
                "message": `Invalid art sub category list id ${req.params.id}`,
                "data": [],
            });
        }
    })
});

// Delete art sub category sub list by id
app.delete("/api/delete-art-sub-category-sub-list/:id", (req: Request, res: Response) => {
    let query: string = `DELETE FROM art_sub_category_sub_list WHERE id=${req.params.id}`;
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
                "message": `Invalid art sub category sub list id ${req.params.id}`,
                "data": [],
            });
        }
    })
});

// Get setting
app.get("/api/get-setting", (req: Request, res: Response) => {
    try {
        let query: string = `SELECT * FROM settings WHERE session_id='${res.locals.shopify.session.id}' LIMIT 1`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            if (results.length > 0) {
                res.status(200).send({
                    "status": true,
                    "message": "Data fetched!",
                    "data": results
                });
            } else {
                res.status(404).send({
                    "status": false,
                    "message": "Data not found!",
                    "data": []
                });
            }
        });
    } catch (e: any) {
        res.status(404).send({
            "status": false,
            "message": e.message,
            "data": []
        });
    }
});

// Add setting
app.post("/api/save-setting", (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let visible_add_art: number = req.body.visible_add_art;
        let visible_upload: number = req.body.visible_upload;
        let visible_add_name: number = req.body.visible_add_name;
        let visible_add_notes: number = req.body.visible_add_notes;

        let query_1: string = `SELECT * FROM settings WHERE session_id='${res.locals.shopify.session.id}' LIMIT 1`;
        mysqlConnection.query(query_1, function (error: any, result_1: any, fields: any) {
            if (error) throw error;
            if (result_1.length > 0) {
                let query_2: string = `UPDATE settings SET visible_add_art = ?, visible_upload = ?, visible_add_name = ?, visible_add_notes = ? WHERE session_id='${res.locals.shopify.session.id}'`;
                let updatedData = [visible_add_art, visible_upload, visible_add_name, visible_add_notes];
                mysqlConnection.query(query_2, updatedData, function (error, result_2, fields) {
                    if (error) throw error;
                    res.status(201).send({
                        "status": true,
                        "message": "Setting updated!",
                        "data": result_2
                    });
                });
            } else {
                mysqlConnection.query('INSERT INTO settings SET ?', {
                    session_id: session_id,
                    visible_add_art: visible_add_art,
                    visible_upload: visible_upload,
                    visible_add_name: visible_add_name,
                    visible_add_notes: visible_add_notes,
                }, function (error: any, results: any, fields: any) {
                    if (error) throw error;
                    res.status(201).send({
                        "status": true,
                        "message": "Setting saved!",
                        "data": results
                    });
                });
            }
        });
    } catch (e: any) {
        res.status(404).send({
            "status": true,
            "message": e.message,
            "data": []
        });
    }
});

// Delete setting by id
app.delete("/api/delete-setting/:id", (req: Request, res: Response) => {
    let query: string = `DELETE FROM settings WHERE id=${req.params.id}`;
    mysqlConnection.query(query, function (error: any, results: any, fields: any) {
        if (error) throw error;
        if (results.affectedRows > 0) {
            res.status(201).send({
                "status": true,
                "message": "Deleted success!",
                "data": results
            });
        } else {
            res.status(404).send({
                "status": true,
                "message": `Invalid art sub category sub list id ${req.params.id}`,
                "data": [],
            });
        }
    })
});

// Add product
app.post("/api/add-product", (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    let productData: any = [];
    let products: any = req.body.products;
    let query: string = "INSERT INTO product_settings (session_id, product_id, product_title, product_image,product_color) VALUES ?";
    products.forEach((item: any, itemKey: any) => {
        productData[itemKey] = [
            session_id,
            item.product_id,
            item.product_title,
            item.product_image,
            item.product_color
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
});

// Get product list
app.get("/api/get-product-list", (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    mysqlConnection.query('select * from product_settings WHERE ?', {
        session_id: session_id
    }, function (err: any, result: any) {
        if (err) throw err
        res.status(200).send({
            "status": true,
            "message": "Data fetched!",
            "data": result
        });
    });
});

// Mapped product from front side
app.post("/api/map-product-front-side/:id", (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    let is_mapped: number = 1;
    let front_image_left: string = req.body.front_image_left;
    let front_image_top: string = req.body.front_image_top;
    let front_crop_width: string = req.body.front_crop_width;
    let front_crop_height: string = req.body.front_crop_height;
    let front_image_width: string = req.body.front_image_width;
    let front_image_height: string = req.body.front_image_height;
    let front_scale_x: string = req.body.front_scale_x;
    let front_scale_y: string = req.body.front_scale_y;
    mysqlConnection.query('INSERT INTO product_settings SET ?', {
        session_id: res.locals.shopify.session.id,
        is_mapped: 1,
        front_image_left: front_image_left,
        front_image_top: front_image_top,
        front_crop_width: front_crop_width,
        front_crop_height: front_crop_height,
        front_image_width: front_image_width,
        front_image_height: front_image_height,
        front_scale_x: front_scale_x,
        front_scale_y: front_scale_y,
    }, function (error: any, results: any, fields: any) {
        if (error) throw error;
        res.status(201).send({
            "status": true,
            "message": "Saved front side product map!",
            "data": results
        });
    });
});

// Mapped product from back side
app.post("/api/map-product-back-side/:id", (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    let is_mapped: number = 1;
    let back_image_left: string = req.body.back_image_left;
    let back_image_top: string = req.body.back_image_top;
    let back_crop_width: string = req.body.back_crop_width;
    let back_crop_height: string = req.body.back_crop_height;
    let back_image_width: string = req.body.back_image_width;
    let back_image_height: string = req.body.back_image_height;
    let back_scale_x: string = req.body.back_scale_x;
    let back_scale_y: string = req.body.back_scale_y;
    mysqlConnection.query('INSERT INTO product_settings SET ?', {
        session_id: res.locals.shopify.session.id,
        is_mapped: 1,
        back_image_left: back_image_left,
        back_image_top: back_image_top,
        back_crop_width: back_crop_width,
        back_crop_height: back_crop_height,
        back_image_width: back_image_width,
        back_image_height: back_image_height,
        back_scale_x: back_scale_x,
        back_scale_y: back_scale_y,
    }, function (error: any, result: any, fields: any) {
        if (error) throw error;
        res.status(201).send({
            "status": true,
            "message": "Saved back side product map!",
            "data": result
        });
    });
});

// Mapped product from left side
app.post("/api/map-product-left-side/:id", (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    let is_mapped: number = 1;
    let left_image_left: string = req.body.left_image_left;
    let left_image_top: string = req.body.left_image_top;
    let left_crop_width: string = req.body.left_crop_width;
    let left_crop_height: string = req.body.left_crop_height;
    let left_image_width: string = req.body.left_image_width;
    let left_image_height: string = req.body.left_image_height;
    let left_scale_x: string = req.body.left_scale_x;
    let left_scale_y: string = req.body.left_scale_y;
    mysqlConnection.query('INSERT INTO product_settings SET ?', {
        session_id: res.locals.shopify.session.id,
        is_mapped: 1,
        left_image_left: left_image_left,
        left_image_top: left_image_top,
        left_crop_width: left_crop_width,
        left_crop_height: left_crop_height,
        left_image_width: left_image_width,
        left_image_height: left_image_height,
        left_scale_x: left_scale_x,
        left_scale_y: left_scale_y,
    }, function (error: any, result: any, fields: any) {
        if (error) throw error;
        res.status(201).send({
            "status": true,
            "message": "Saved left side product map!",
            "data": result
        });
    });
});

// Mapped product from right side
app.post("/api/map-product-right-side/:id", (req: Request, res: Response) => {
    let session_id: string = res.locals.shopify.session.id;
    let is_mapped: number = 1;
    let right_image_left: string = req.body.right_image_left;
    let right_image_top: string = req.body.right_image_top;
    let right_crop_width: string = req.body.right_crop_width;
    let right_crop_height: string = req.body.right_crop_height;
    let right_image_width: string = req.body.right_image_width;
    let right_image_height: string = req.body.right_image_height;
    let right_scale_x: string = req.body.right_scale_x;
    let right_scale_y: string = req.body.right_scale_y;
    mysqlConnection.query('INSERT INTO product_settings SET ?', {
        session_id: res.locals.shopify.session.id,
        is_mapped: 1,
        right_image_left: right_image_left,
        right_image_top: right_image_top,
        right_crop_width: right_crop_width,
        right_crop_height: right_crop_height,
        right_image_width: right_image_width,
        right_image_height: right_image_height,
        right_scale_x: right_scale_x,
        right_scale_y: right_scale_y,
    }, function (error: any, result: any, fields: any) {
        if (error) throw error;
        res.status(201).send({
            "status": true,
            "message": "Saved right side product map!",
            "data": result
        });
    })
})

// Delete setting by id
app.delete("/api/delete-product/:id", (req: Request, res: Response) => {
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
});

// Create Text Setting
app.post("/api/create-text-setting", (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let font_style: string = req.body.font_style;
        let font_color: string = req.body.font_color;
        let text_outline_color: string = req.body.text_outline_color;
        mysqlConnection.query('INSERT INTO text_settings SET ?', {
            session_id: session_id,
            font_style: font_style,
            font_color: font_color,
            text_outline_color: text_outline_color
        }, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(201).send({
                "status": true,
                "message": "Font color Added!",
                "data": results
            });
        });
    } catch (e: any) {
        res.status(500).send({
            "status": false,
            "message": e.message,
            "data": []
        });
    }
});

// Get Text Setting
app.get("/api/get-text-setting", (req: Request, res: Response) => {
    try {
        let query: string = `SELECT * FROM text_settings WHERE session_id='${res.locals.shopify.session.id}'`;
        mysqlConnection.query(query, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(200).send({
                "status": true,
                "message": "Data fetched!",
                "data": results
            });
        });
    } catch (e: any) {
        res.status(404).send({
            "status": false,
            "message": e.message,
            "data": []
        });
    }
});

// Delete Text Setting by id
app.delete("/api/delete-text-setting/:id", (req: Request, res: Response) => {
    let query: string = `DELETE FROM text_settings WHERE id=${req.params.id}`;
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
                "message": `Invalid text setting id ${req.params.id}`,
                "data": [],
            });
        }
    });
});

// ...................................

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
    return res
        .status(200)
        .set("Content-Type", "text/html")
        .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
