import { Request, Response } from "express";
import mysqlConnection from "../config/mySqlConnection.js";
import dotenv from "dotenv";
dotenv.config();
const FILE_PATH = `${process.env.APP_URL}${process.env.FILE_UPLOAD_PATH}`;

// Create text font color setting
const createTextFontColor = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let name: string = req.body.name;
        let color: string = req.body.color;
        mysqlConnection.query('INSERT INTO text_colors SET ?', {
            session_id: session_id,
            name: name,
            color: color
        }, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(201).send({
                "status": true,
                "message": "Font color Added!",
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

// Get text font color setting
const getTextFontColors = async (req: Request, res: Response) => {
    try {
        let query: string = `SELECT * FROM text_colors WHERE session_id='${res.locals.shopify.session.id}'`;
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

// Delete text font color setting by id
const deleteTextFontColorById = async (req: Request, res: Response) => {
    try {
        let query: string = `DELETE FROM text_colors WHERE id=${req.params.id}`;
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
                    "status": false,
                    "message": `Invalid text setting id ${req.params.id}`,
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

// Create text font color setting
const createTextOutlineColor = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let name: string = req.body.name;
        let color: string = req.body.color;
        mysqlConnection.query('INSERT INTO text_outline_colors SET ?', {
            session_id: session_id,
            name: name,
            color: color
        }, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(201).send({
                "status": true,
                "message": "Outline color Added!",
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

// Get text font outline color setting
const getTextOutlineColors = async (req: Request, res: Response) => {
    try {
        let query: string = `SELECT * FROM text_outline_colors WHERE session_id='${res.locals.shopify.session.id}'`;
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

// Delete text font outline color setting by id
const deleteTextOutlineColorById = async (req: Request, res: Response) => {
    try {
        let query: string = `DELETE FROM text_outline_colors WHERE id=${req.params.id}`;
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
                    "status": false,
                    "message": `Invalid text outline color id ${req.params.id}`,
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

// Create text font
const createTextFont = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let name: string = req.body.name;
        mysqlConnection.query('INSERT INTO text_fonts SET ?', {
            session_id: session_id,
            name: name,
        }, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(201).send({
                "status": true,
                "message": "Text font added!",
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

// Get text font style list
const getTextFontList = async (req: Request, res: Response) => {
    try {
        let query: string = `SELECT * FROM text_fonts WHERE session_id='${res.locals.shopify.session.id}'`;
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

// Delete Text Font by id
const deleteTextFontById = async (req: Request, res: Response) => {
    try {
        let query: string = `DELETE FROM text_fonts WHERE id=${req.params.id}`;
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
                    "status": false,
                    "message": `Invalid text font id ${req.params.id}`,
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

// Create sub text font by id
const createSubTextFontById = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let font_id: string = req.params.font_id;
        let name: string = req.body.name;
        let file: any = await req.file;
        let uploadedFilePath: any = file ? FILE_PATH + file.filename : null;
        mysqlConnection.query('INSERT INTO text_font_list SET ?', {
            session_id: session_id,
            font_id: font_id,
            name: name,
            image: uploadedFilePath
        }, function (error: any, results: any, fields: any) {
            if (error) throw error;
            res.status(201).send({
                "status": true,
                "message": "Text font added!",
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

// Get text sub font list by id
const getTextSubFontListById = async (req: Request, res: Response) => {
    try {
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

// Delete text sub font by id
const deleteTextSubFontById = async (req: Request, res: Response) => {
    try {
        let query: string = `DELETE FROM text_font_list WHERE id=${req.params.id}`;
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
                    "status": false,
                    "message": `Invalid text font id ${req.params.id}`,
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

/*
// Create text setting
const createTextSetting = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Get text setting
const getTextSetting = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Delete text setting
const deleteTextSettingById = async (req: Request, res: Response) => {
    try {
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
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};
*/

export {
    createTextFontColor,
    getTextFontColors,
    deleteTextFontColorById,
    createTextOutlineColor,
    getTextOutlineColors,
    deleteTextOutlineColorById,
    createTextFont,
    getTextFontList,
    deleteTextFontById,
    createSubTextFontById,
    getTextSubFontListById,
    deleteTextSubFontById,
    // createTextSetting,
    // getTextSetting,
    // deleteTextSettingById
};
