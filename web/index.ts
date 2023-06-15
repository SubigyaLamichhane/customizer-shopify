// @ts-check
import path, { join } from "path";
import { readFileSync, readFile } from "fs";
import express, { Request, Response, Express } from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { mysqlConnection } from "./src/config/mySqlConnection.js";
import cors from "cors";

// use body-parser for fetch request body
import bodyParser from "body-parser";
import gm from "gm";
import upload from "./src/config/uploadFile.js";

// import all router
import frontendRouter from "./src/routes/frontendRouter.js";
import artCategoryRouter from "./src/routes/artCategory.js";
import settingRouter from "./src/routes/setting.js";
import prodRouter from "./src/routes/product.js";
import textSettingRouter from "./src/routes/textSetting.js";

import dotenv from 'dotenv';
dotenv.config();
const __dirname = path.resolve();
// const __dirname = path.resolve()  + "/web";
console.log(process.env.BACKEND_PORT, 'port', process.env.PORT);

// const PORT = 3000;
const PORT = process.env.BACKEND_PORT || process.env.PORT;
// const FILE_PATH = "https://staging.whattocookai.com/api/uploads/public/uploads/";
const FILE_PATH = `${process.env.APP_URL}${process.env.FILE_UPLOAD_PATH}`;

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
    // async (req: Request, res: Response) => {
    //     const page = new shopify.api.rest.Page({
    //         session: res.locals.shopify.session,
    //     });
    //     page.title = "Customizer";
    //     page.body_html = "<h2>Customizer</h2>\n<p><strong>customize you product!</strong>.</p>";
    //     const response = await page.save({
    //         update: true,
    //     });
    //     console.log('callbackPath',response)
    //     // return true;
    // },
    shopify.redirectToShopifyOrAppRoot()
);
app.post(
    shopify.config.webhooks.path,
    // @ts-ignore
    shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" folder
app.get("/api/uploads/*", async (req, res, _next) => {
    let newPath = req.originalUrl.replace("/api/uploads", ".");
    res.sendFile(path.join(__dirname, newPath));
    // url = https://4d4f-103-21-55-66.ngrok-free.app/api/uploads/public/uploads/dummy-image.jpg
});

// ...................................
// Front end api's.
app.use("/api/front-end", frontendRouter);

// Convert pdf/ai/eps/jpg/jpeg/psd file into png formate
app.post("/api/convert-file", upload.single('image'), async (req: Request, res: Response) => {
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
});

// api for testing
app.get("/api/test", (req: Request, res: Response) => {
    res.status(200).send({
        "status": true,
        "message": "Test Api!",
        "data": []
    });
});

// ...................................
// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

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

// Create page on shopify and add default entry for customization setting
app.get("/api/page/create", async (req: Request, res: Response) => {
    const page = new shopify.api.rest.Page({
        session: res.locals.shopify.session,
    });
    page.title = "Customizer";
    page.body_html = readFileSync('./store-frontend/customizer.html', 'utf-8');
    const response = await page.save({
        update: true,
    });
    let query: string = `UPDATE shopify_sessions SET is_pages_created = '1', page_id = ${page.id} WHERE id='${res.locals.shopify.session.id}'`;
    mysqlConnection.query(query, function (error, result) {
        if (error) throw error;
        res.status(201).send({
            "status": true,
            "message": "Setting updated!",
            "data": result,
            "page": page
        });
    });
});

// import all router
app.use("/api", artCategoryRouter);

app.use("/api", settingRouter);

app.use("/api", prodRouter);

app.use("/api", textSettingRouter);

// ...................................

app.use(serveStatic(STATIC_PATH, { index: false }));
console.log('STATIC_PATH', STATIC_PATH)
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
    return res
        .status(200)
        .set("Content-Type", "text/html")
        .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

/*
Make changes on server

1) file name = /web/src/config/uploadFile.ts
const STORAGE_PATH = "/web/public/uploads/";

2) file name = /web/src/controllers/ (all controllers)
const FILE_PATH = "http://staging.whattocookai.com/api/uploads/public/uploads/";

3) file name = index.ts
const PORT = process.env.BACKEND_PORT || process.env.PORT; to const PORT = 3000;
`${process.cwd()}/frontend/dist` = `${process.cwd()}/web/frontend/dist`
`${process.cwd()}/frontend/` = `${process.cwd()}/web/frontend/`
const __dirname = path.resolve(); to const __dirname = path.resolve()  + "/web";

4) file name = /web/frontend/App.jsx
const API_URL = "https://staging.whattocookai.com/api";

5) file name = package.json of root
"deploy": "shopify app deploy",
"serve": "cross-env NODE_ENV=production ts-node web/index.ts",
"start": "npm run serve"

6) file name = web/src/config/mySqlConnection.js
import mysql from "mysql";

const mysqlConnection = mysql.createConnection({
   host: '127.0.0.1',
   user: 'root',
   password: '9QJcdfJgr3s901e8',
   database: 'customizer'
});
mysqlConnection.connect(function (err) {
   if (err) throw err;
   else {
       console.log('Connected to mysql!');
   }
});

const queryPromise= (query) => {
   return new Promise((resolve, reject) => {
       mysqlConnection.query(query, function (err, result) {
           if (err) reject(err);
           resolve(result);
       });
   });
}

// function queryPromise(query: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//         mysqlConnection.query(query, function (err: any, result: any) {
//             if (err) reject(err);
//             resolve(result);
//         });
//     });
// }

// export default mysqlConnection;

export {
   mysqlConnection,
   queryPromise
};

7) file name = web/shopify.js
import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
// import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { MySQLSessionStorage } from '@shopify/shopify-app-session-storage-mysql';
import { restResources } from "@shopify/shopify-api/rest/admin/2023-01";

// const DB_PATH = `${process.cwd()}/database.sqlite`;

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: MySQLSessionStorage.withCredentials(
    'localhost',
    'customizer',
    'root',
    '12345',
  ),
  // sessionStorage: new SQLiteSessionStorage(DB_PATH),
});

export default shopify;

*/