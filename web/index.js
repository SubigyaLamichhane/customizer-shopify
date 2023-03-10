// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
// import { MySqlConnection } from "@shopify/shopify-app-session-storage-mysql/build/ts/mysql-connection.js";
import { MySQLSessionStorage } from '@shopify/shopify-app-session-storage-mysql';
// import connection from "./mySqlConnection.js";

import { PrismaClient } from '@prisma/client';
import mysqlConnection from "./mySqlConnection.js";

// use body-parser for fetch request body
import bodyParser from "body-parser";
import { shopifyApp } from "@shopify/shopify-app-express";

import { Session } from '@shopify/shopify-api';

const prisma = new PrismaClient();

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(bodyParser.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// ...................................

// Get art category list
app.get("/api/get-art-category-list", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_category WHERE ='${res.locals.shopify.session.id}'`, function(err, result) {
      if(err) throw err
      res.status(200).send(result)
  });
});

// Create art category
app.post("/api/create-art-category", async (req, res) => {
  mysqlConnection.query('INSERT INTO art_category SET ?', { 
    session_id: res.locals.shopify.session.id, 
    name: req.body.name, 
    backgroud_image: req.body.backgroud_image
  }, function (error, results, fields) {
    if (error) throw error;
    let artCategoryId = results.insertId;
    res.status(201).send(results)
  });
});

// Create art sub category
app.post("/api/create-art-sub-category/:art_category_id", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_category WHERE id=${req.params.art_category_id}`, function (error, results_1, fields) {
    if (error) throw error;
    if (results_1.length > 0) {
      mysqlConnection.query('INSERT INTO art_sub_category SET ?', { 
        art_category_id: req.params.art_category_id, 
        name: req.body.name, 
      }, function (error, results, fields) {
        if (error) throw error;
        res.status(201).send(results);
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art category id ${req.params.art_category_id}`,
      });
    }
  });
});

// Create art sub category list
app.post("/api/create-art-sub-category-list/:art_sub_category_id", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_sub_category WHERE id=${req.params.art_sub_category_id}`, function (error, results_1, fields) {
    if (error) throw error;
    if (results_1.length > 0) {
      mysqlConnection.query('INSERT INTO art_sub_category_list SET ?', { 
        art_sub_category_id: req.params.art_sub_category_id, 
        name: req.body.name, 
        image_src: req.body.image_src
      }, function (error, results, fields) {
        if (error) throw error;
        res.status(201).send(results);
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art sub category id ${req.params.art_sub_category_id}`,
      });
    }
  });
});

// Create art sub category list sub
app.post("/api/create-art-sub-category-sub-list/:art_sub_category_list_id", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_sub_category_list WHERE id=${req.params.art_sub_category_list_id}`, function (error, results_1, fields) {
    if (error) throw error;
    if (results_1.length > 0) {
      mysqlConnection.query('INSERT INTO art_sub_category_sub_list SET ?', { 
        art_sub_category_list_id: req.params.art_sub_category_list_id, 
        image_src: req.body.image_src
      }, function (error, results, fields) {
        if (error) throw error;
        res.status(201).send(results);
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art sub category list id! ${req.params.art_sub_category_list_id}`,
      });
    }
  });
});

// Delete art category by id
app.delete("/api/delete-art-category/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_category WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art category id ${req.params.id}`,
      });
    }
  });
});

// Delete art sub category by id
app.delete("/api/delete-art-sub-category/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_sub_category WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art sub category id ${req.params.id}`,
      });
    }
  })
});

// Delete art sub category list by id
app.delete("/api/delete-art-sub-category-list/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_sub_category_list WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art sub category list id ${req.params.id}`,
      });
    }
  })
});

// Delete art sub category sub list by id
app.delete("/api/delete-art-sub-category-sub-list/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_sub_category_sub_list WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art sub category sub list id ${req.params.id}`,
      });
    }
  })
});

// Get setting
app.get("/api/get-setting", (req, res) => {
  try {
    mysqlConnection.query(`SELECT * FROM settings WHERE session_id='${res.locals.shopify.session.id}'`, function (error, results, fields) {
      if (error) throw error;
      res.status(200).send({
        "status": true,
        "message": "Data fetched!",
        "data": results
      });
    });
  } catch (e) {
    res.status(404).send({
      "status": false,
      "message": e.message,
      "data": []
    });
  }
});

// Add setting
app.post("/api/add-setting", async (req, res) => {
  try {
    mysqlConnection.query('INSERT INTO settings SET ?', { 
      session_id: res.locals.shopify.session.id, 
      visible_add_art: req.body.visible_add_art, 
      visible_upload: req.body.visible_upload, 
      visible_add_name: req.body.visible_add_name, 
      visible_add_notes: req.body.visible_add_notes,
    }, function (error, results, fields) {
      if (error) throw error;
      res.status(201).send(results);
    });
  } catch (e) {
    res.status(404).send({
      "data": [],
      "message": e.message
    });
  }
});

// Delete setting by id
app.delete("/api/delete-setting/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM settings WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid art sub category sub list id ${req.params.id}`,
      });
    }
  })
});

// Add product
app.post("/api/add-product", (req, res) => {
  mysqlConnection.query('INSERT INTO product_settings SET ?', {
    session_id: res.locals.shopify.session.id,
    product_id: req.body.product_id, 
    product_title: req.body.product_title,
    product_image: req.body.product_image,
    product_color: req.body.product_color,
  }, function (error, result, fields) {
    if (error) throw error;
    if (result.affectedRows > 0) {
      res.status(201).send({
        "data": result,
        "message": "Product Added!",
      });
    } else {
      res.status(500).send({
        "data": [],
        "message": 'Something went wrong!',
      });
    }
  });
});

// Get product list
app.get("/api/get-product-list", (req, res) => {
  mysqlConnection.query('select * from product_settings WHERE ?', {
    id: res.locals.shopify.session.id
  }, function(err, result) {
      if(err) throw err
      res.status(200).send(result)
  });
});

// Mapped product from front side
app.post("/api/map-product-front-side/:id", (req, res) => {
  mysqlConnection.query('INSERT INTO product_settings SET ?', { 
    session_id: res.locals.shopify.session.id, 
    is_mapped: 1, 
    front_image_left: req.body.front_image_left, 
    front_image_top: req.body.front_image_top, 
    front_crop_width: req.body.front_crop_width, 
    front_crop_height: req.body.front_crop_height,
    front_image_width: req.body.front_image_width,
    front_image_height: req.body.front_image_height,
    front_scale_x: req.body.front_scale_x,
    front_scale_y: req.body.front_scale_y,
  }, function (error, results, fields) {
    if (error) throw error;
    res.status(201).send(results)
  });
});

// Mapped product from back side
app.post("/api/map-product-back-side/:id", (req, res) => {
  mysqlConnection.query('INSERT INTO product_settings SET ?', {
    session_id: res.locals.shopify.session.id, 
    is_mapped: 1,
    back_image_left: req.body.back_image_left,
    back_image_top: req.body.back_image_top,
    back_crop_width: req.body.back_crop_width,
    back_crop_height: req.body.back_crop_height,
    back_image_width: req.body.back_image_width,
    back_image_height: req.body.back_image_height,
    back_scale_x: req.body.back_scale_x,
    back_scale_y: req.body.back_scale_y, 
  }, function (error, result, fields) {
    if (error) throw error;
    res.status(201).send(result);
  });
});

// Mapped product from left side
app.post("/api/map-product-left-side/:id", (req, res) => {
  mysqlConnection.query('INSERT INTO product_settings SET ?', {
    session_id: res.locals.shopify.session.id, 
    is_mapped: 1,
    left_image_left: req.body.left_image_left,
    left_image_top: req.body.left_image_top,
    left_crop_width: req.body.left_crop_width,
    left_crop_height: req.body.left_crop_height,
    left_image_width: req.body.left_image_width,
    left_image_height: req.body.left_image_height,
    left_scale_x: req.body.left_scale_x,
    left_scale_y: req.body.left_scale_y,
  }, function (error, result, fields) {
    if (error) throw error;
    res.status(201).send(result);
  });
});

// Mapped product from right side
app.post("/api/map-product-right-side/:id", (req, res) => {
  mysqlConnection.query('INSERT INTO product_settings SET ?', {
    session_id: res.locals.shopify.session.id, 
    is_mapped: 1,
    right_image_left: req.body.right_image_left,
    right_image_top: req.body.right_image_top,
    right_crop_width: req.body.right_crop_width,
    right_crop_height: req.body.right_crop_height,
    right_image_width: req.body.right_image_width,
    right_image_height: req.body.right_image_height,
    right_scale_x: req.body.right_scale_x,
    right_scale_y: req.body.right_scale_y,
  }, function (error, result, fields) {
    if (error) throw error;
    res.status(201).send(result);
  })
})

// Delete setting by id
app.delete("/api/delete-product/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM products WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid product id ${req.params.id}`,
      });
    }
  });
});

// Create Text Setting
app.post("/api/create-text-setting", (req, res) => {
  try {
    mysqlConnection.query('INSERT INTO text_settings SET ?', {
      session_id: res.locals.shopify.session.id,
      font_style: req.body.font_style,
      font_color: req. body.font_color,
      text_outline_color: req.body.text_outline_color
    }, function (error,results,fields) {
      if (error) throw error;
      res.status(201).send({
        "status": true,
        "message": "Font color Added!",
        "data": results
      });
    });
  } catch (e) {
    res.status(500).send({
      "status": false,
      "message": e.message,
      "data": []
    });
  }
});

// Get Text Setting
app.get("/api/get-text-setting", (req, res) => {
  try {
    mysqlConnection.query(`SELECT * FROM text_settings WHERE session_id='${res.locals.shopify.session.id}'`, function (error, results, fields) {
      if (error) throw error;
      res.status(200).send({
        "status": true,
        "message": "Data fetched!",
        "data": results
      });
    });
  } catch (e) {
    res.status(404).send({
      "status": false,
      "message": e.message,
      "data": []
    });
  }
});

// Delete Text Setting by id
app.delete("/api/delete-text-setting/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM text_settings WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(404).send({
        "data": [],
        "message": `Invalid text setting id ${req.params.id}`,
      });
    }
  });
});

// Create product with setting ruff api
app.post("/api/create-product", async (req, res) => {
  mysqlConnection.query('INSERT INTO product SET ?', { 
    session_id: res.locals.shopify.session.id, 
    product_id: req.body.product_id, 
    product_title: req.body.product_title, 
    product_image: req.body.product_image, 
    product_color: req.body.product_color, 

    front_image_left: req.body.front_image_left, 
    front_image_top: req.body.front_image_top, 
    front_crop_width: req.body.front_crop_width, 
    front_crop_height: req.body.front_crop_height,
    front_image_width: req.body.front_image_width,
    front_image_height: req.body.front_image_height,
    front_scale_x: req.body.front_scale_x,
    front_scale_y: req.body.front_scale_y,

    back_image_left: req.body.back_image_left,
    back_image_top: req.body.back_image_top,
    back_crop_width: req.body.back_crop_width,
    back_crop_height: req.body.back_crop_height,
    back_image_width: req.body.back_image_width,
    back_image_height: req.body.back_image_height,
    back_scale_x: req.body.back_scale_x,
    back_scale_y: req.body.back_scale_y,

    left_image_left: req.body.left_image_left,
    left_image_top: req.body.left_image_top,
    left_crop_width: req.body.left_crop_width,
    left_crop_height: req.body.left_crop_height,
    left_image_width: req.body.left_image_width,
    left_image_height: req.body.left_image_height,
    left_scale_x: req.body.left_scale_x,
    left_scale_y: req.body.left_scale_y,
    right_image_left: req.body.right_image_left,
    right_image_top: req.body.right_image_top,
    right_crop_width: req.body.right_crop_width,
    right_crop_height: req.body.right_crop_height,
    right_image_width: req.body.right_image_width,
    right_image_height: req.body.right_image_height,
    right_scale_x: req.body.right_scale_x,
    right_scale_y: req.body.right_scale_y
  }, function (error, results, fields) {
    if (error) throw error;
    res.status(200).send(results)
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
