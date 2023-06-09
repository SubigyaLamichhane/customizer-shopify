// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express, { Request, Response, Express } from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import mysqlConnection from "./mySqlConnection.js";
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

console.log(process.env.BACKEND_PORT, 'hello', process.env.PORT);

import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.APP_URL);


// local environment
const PORT = process.env.BACKEND_PORT || process.env.PORT;
const APP_URL = process.env.HOST;
const FILE_PATH = process.env.HOST + "/assets/public/uploads/";

// production environment
// const PORT = 3000;
// const APP_URL = "https://staging.whattocookai.com/";
// const FILE_PATH = "https://staging.whattocookai.com/assets/";

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

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
    return res
        .status(200)
        .set("Content-Type", "text/html")
        .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

// make changes on server
// replace some lines 
// cb(null, path.join(__dirname, '/public/uploads/')); = cb(null, path.join(__dirname, '/web/public/uploads/'));
// uploadedFilePath: string  = "https://staging.whattocookai.com/assets/" + image.filename;
// const PORT = process.env.BACKEND_PORT || process.env.PORT; = const PORT = 3000;
// `${process.cwd()}/frontend/dist` = `${process.cwd()}/web/frontend/dist`
// `${process.cwd()}/frontend/` = `${process.cwd()}/web/frontend/`
// "data": destination + fileName = "http://customizer.sketchthemes.com:8080/customizer-shopify-app/web/public/uploads/" + fileName