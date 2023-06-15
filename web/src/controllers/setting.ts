import { Request, Response } from "express";
import { mysqlConnection, queryPromise } from "../config/mySqlConnection.js";

// Get setting
const getSetting = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Save or Update setting
const saveSetting = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let visible_add_text: number = req.body.visible_add_text;
        let visible_add_art: number = req.body.visible_add_art;
        let visible_upload: number = req.body.visible_upload;
        let visible_add_name: number = req.body.visible_add_name;
        let visible_add_notes: number = req.body.visible_add_notes;
        console.log('visible_add_text',visible_add_text)

        let query_1: string = `SELECT * FROM settings WHERE session_id='${res.locals.shopify.session.id}' LIMIT 1`;
        mysqlConnection.query(query_1, function (error: any, result_1: any, fields: any) {
            if (error) throw error;
            if (result_1.length > 0) {
                let query_2: string = `UPDATE settings SET visible_add_text = ?, visible_add_art = ?, visible_upload = ?, visible_add_name = ?, visible_add_notes = ? WHERE session_id='${res.locals.shopify.session.id}'`;
                let updatedData = [visible_add_text, visible_add_art, visible_upload, visible_add_name, visible_add_notes];
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
                    visible_add_text: visible_add_text,
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
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Delete setting by id
const deleteSettingById =async (req: Request, res: Response) => {
    try {
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
    getSetting,
    saveSetting,
    deleteSettingById
};