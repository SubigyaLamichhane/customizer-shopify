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
app.get("/api/art_category", (req, res) => {
  mysqlConnection.query('select * from art_category', function(err, result) {
      if(err) throw err
      res.status(200).send(result)
  });
});

// Create art category
app.post("/api/art_category/create", async (req, res) => {
  mysqlConnection.query('INSERT INTO art_category SET ?', { 
    user_id: req.body.user_id, 
    name: req.body.name, 
    backgroud_image: req.body.backgroud_image
  }, function (error, results, fields) {
    if (error) throw error;
    let artCategoryId = results.insertId;
    res.status(200).send(results)
  });
});

// Create art sub category
app.post("/api/art_sub_category/create/:art_category_id", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_category WHERE id=${req.params.art_category_id}`, function (error, results_1, fields) {
    if (error) throw error;
    if (results_1.length > 0) {
      mysqlConnection.query('INSERT INTO art_sub_category SET ?', { 
        art_category_id: req.params.art_category_id, 
        name: req.body.name, 
      }, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send(results);
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art category id ${req.params.art_category_id}`,
      });
    }
  });
});

// Create art sub category list
app.post("/api/art_sub_category_list/create/:art_sub_category_id", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_sub_category WHERE id=${req.params.art_sub_category_id}`, function (error, results_1, fields) {
    if (error) throw error;
    if (results_1.length > 0) {
      mysqlConnection.query('INSERT INTO art_sub_category_list SET ?', { 
        art_sub_category_id: req.params.art_sub_category_id, 
        name: req.body.name, 
        image_src: req.body.image_src
      }, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send(results);
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art sub category id ${req.params.art_sub_category_id}`,
      });
    }
  });
});

// Create art sub category list sub
app.post("/api/art_sub_category_sub_list/create/:art_sub_category_list_id", (req, res) => {
  mysqlConnection.query(`SELECT * FROM art_sub_category_list WHERE id=${req.params.art_sub_category_list_id}`, function (error, results_1, fields) {
    if (error) throw error;
    if (results_1.length > 0) {
      mysqlConnection.query('INSERT INTO art_sub_category_sub_list SET ?', { 
        art_sub_category_list_id: req.params.art_sub_category_list_id, 
        image_src: req.body.image_src
      }, function (error, results, fields) {
        if (error) throw error;
        res.status(200).send(results);
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art sub category list id! ${req.params.art_sub_category_list_id}`,
      });
    }
  });
});

// Delete art category by id
app.delete("/api/delete/art_category/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_category WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art category id ${req.params.id}`,
      });
    }
  })
});

// Delete art sub category by id
app.delete("/api/delete/art_sub_category/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_sub_category WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art sub category id ${req.params.id}`,
      });
    }
  })
});

// Delete art sub category list by id
app.delete("/api/delete/art_sub_category_list/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_sub_category_list WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art sub category list id ${req.params.id}`,
      });
    }
  })
});

// Delete art sub category sub list by id
app.delete("/api/delete/art_sub_category_sub_list/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM art_sub_category_sub_list WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art sub category sub list id ${req.params.id}`,
      });
    }
  })
});

// Get setting list
app.get("/api/get-setting", (req, res) => {
  res.send(res.locals.shopify.session);
  // mysqlConnection.query(`select * from settings WHERE id=${req.body.user_id}`, 
  // function(err, result) {
  //     if(err) throw err
  //     res.status(200).send(result)
  // });
});

// Create setting
app.post("/api/setting/create", async (req, res) => {
  mysqlConnection.query('INSERT INTO settings SET ?', { 
    user_id: req.body.user_id, 
    text: req.body.text, 
    use_greek_letter: req.body.use_greek_letter, 
    font_setting: req.body.font_setting, 
    text_color_setting: req.body.text_color_setting, 
    rotation_setting: req.body.rotation_setting, 
    outline_setting: req.body.outline_setting, 
    text_shape_setting: req.body.text_shape_setting, 
    text_size_setting: req.body.text_size_setting,
    upload_video: req.body.upload_video
  }, function (error, results, fields) {
    if (error) throw error;
    res.status(200).send(results)
  });
});

// Delete setting by id
app.delete("/api/delete/setting/:id", (req, res) => {
  mysqlConnection.query(`DELETE FROM settings WHERE id=${req.params.id}`, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.status(200).send({
        "data": results,
        "message": "Deleted success!",
      });
    } else {
      res.status(200).send({
        "data": [],
        "message": `Invalid art sub category sub list id ${req.params.id}`,
      });
    }
  })
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
