import { Request, Response } from "express";
import { mysqlConnection, queryPromise } from "../config/mySqlConnection.js";
import dotenv from "dotenv";
dotenv.config();
// const FILE_PATH = "http://staging.whattocookai.com/api/uploads/public/uploads/";
const FILE_PATH = `${process.env.APP_URL}${process.env.FILE_UPLOAD_PATH}`;

console.log('FILE_PATH',FILE_PATH)

// Get art category list
const getArtCategoryList = (req: Request, res: Response) => {
    console.log('res.locals.shopify.session',res.locals.shopify.session)
    try {
        let query: string = `SELECT * FROM art_category WHERE session_id='${res.locals.shopify.session.id}'`;
        mysqlConnection.query(query, function (err: any, result: any) {
            if (err) throw err
            res.status(200).send({
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

// Get art category by id
const getArtCategoryById = async (req: Request, res: Response) => {
    try {
        let query_1: string = `SELECT * FROM art_category WHERE id=${req.params.id} LIMIT 1`;
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
                        "message": "Data fetch",
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

// Create art category
const createArtCategory = async (req: Request, res: Response) => {
    try {
        let session_id: string = res.locals.shopify.session.id;
        let name: string = req.body.name;
        let background_color: string = req.body.background_color;
        let image: any = await req.file;
        let uploadedFilePath: any = FILE_PATH + image.filename;
        mysqlConnection.query('INSERT INTO art_category SET ?', {
            session_id: session_id,
            name: name,
            background_image: uploadedFilePath,
            background_color: background_color
        }, function (error: any, results: any, fields: any) {
            if (error) throw error;
            let artCategoryId: number = results.insertId;
            res.status(201).send({
                "status": true,
                "message": "Created art category!",
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

// Create art sub category
const createArtSubCategoryByArtId = async (req: Request, res: Response) => {
    try {
        let art_category_id: any = req.params.art_category_id;
        let name: string = req.body.name;
        let child_list: string = req.body.child_list;
        let query: string = `SELECT * FROM art_category WHERE id=${art_category_id}`;
        mysqlConnection.query(query, function (error: any, results_1: any, fields: any) {
            if (error) throw error;
            if (results_1.length > 0) {
                mysqlConnection.query('INSERT INTO art_sub_category SET ?', {
                    art_category_id: art_category_id,
                    name: name,
                    child_list: child_list
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
                    "status": false,
                    "message": `Invalid art category id ${req.params.art_category_id}`,
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

// Get art sub category by id's (category_id/sub_category_id)
const getArtSubCategoryByIdAndSubId = async (req: Request, res: Response) => {
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

// Get art sub category sub list by id's (category_id/sub_category_id/sub_category_list_id)
const getArtSubCategorySubList = async (req: Request, res: Response) => {
    try {
        let query_1: string = `SELECT * FROM art_category WHERE id=${req.params.category_id} LIMIT 1`;
        var data: any = [];
        mysqlConnection.query(query_1, function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                data.push(result_1[0]);
                let query_2: string = `SELECT * FROM art_sub_category WHERE art_category_id=${req.params.category_id}`;
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

// Create art sub category list by art sub category id (art_sub_category_id)
const createArtSubCategoryListBySubCategoryId = async (req: Request, res: Response) => {
    try {
        let files: any = await req.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let image = files[i];
                let uploadedFilePath: any = image ? FILE_PATH + image.filename : null;
                let query: string = `SELECT * FROM art_sub_category WHERE id=${req.params.art_sub_category_id}`;
                mysqlConnection.query(query, function (error: any, results_1: any, fields: any) {
                    if (error) throw error;
                    if (results_1.length > 0) {
                        mysqlConnection.query('INSERT INTO art_sub_category_list SET ?', {
                            art_sub_category_id: req.params.art_sub_category_id,
                            image: uploadedFilePath,
                            child_list: "art_image"
                        }, function (error: any, results: any, fields: any) {
                            if (error) throw error;
                            // res.status(201).send({
                            //     "status": true,
                            //     "message": "Created art category list!",
                            //     "data": results
                            // });
                        });
                    } else {
                        res.status(404).send({
                            "status": false,
                            "message": `Invalid art sub category id ${req.params.art_sub_category_id}`,
                            "data": [],
                        });
                    }
                });
            }
            res.status(201).send({
                "status": true,
                "message": "Created art category list!",
            });
        } else {
            let name: string = req.body.name;
            let query: string = `SELECT * FROM art_sub_category WHERE id=${req.params.art_sub_category_id}`;
            mysqlConnection.query(query, function (error: any, results_1: any, fields: any) {
                if (error) throw error;
                if (results_1.length > 0) {
                    mysqlConnection.query('INSERT INTO art_sub_category_list SET ?', {
                        art_sub_category_id: req.params.art_sub_category_id,
                        name: name,
                        child_list: "art_image"
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
                        "status": false,
                        "message": `Invalid art sub category id ${req.params.art_sub_category_id}`,
                        "data": [],
                    });
                }
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

// Get art sub category sub list by id's (id)
const getArtSubCategorySubListById = async (req: Request, res: Response) => {
    try {
        let query_1: string = `SELECT * FROM art_sub_category_list WHERE id=${req.params.id} LIMIT 1`;
        var data: any = [];
        mysqlConnection.query(query_1, function (err: any, result_1: any) {
            if (err) throw err;
            if (result_1.length > 0) {
                let query_2: string = `SELECT * FROM art_sub_category_sub_list WHERE art_sub_category_list_id=${req.params.id}`;
                data.push(result_1[0]);
                mysqlConnection.query(query_2, function (err: any, result_2: any) {
                    if (err) throw err;
                    if (result_2.length > 0) {
                        data[0].sub_category = result_2;
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
                    "message": `Invalid art sub category list id ${req.params.id}`,
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

// Create art sub category sub list by art sub category list id (art_sub_category_list_id)
const createArtSubCategorySubListBySubCategoryListId = async (req: Request, res: Response) => {
    try {
        let files: any = await req.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let image = files[i];
                let uploadedFilePath: any = image ? FILE_PATH + image.filename : null;
                let query: string = `SELECT * FROM art_sub_category_list WHERE id=${req.params.art_sub_category_list_id}`;
                mysqlConnection.query(query, function (error, results_1, fields) {
                    if (error) throw error;
                    if (results_1.length > 0) {
                        mysqlConnection.query('INSERT INTO art_sub_category_sub_list SET ?', {
                            art_sub_category_list_id: req.params.art_sub_category_list_id,
                            image: uploadedFilePath
                        }, function (error: any, results: any, fields: any) {
                            if (error) throw error;
                            // res.status(201).send({
                            //     "status": true,
                            //     "message": "Created art sub category list!",
                            //     "data": results,
                            // });
                        });
                    } else {
                        res.status(404).send({
                            "status": false,
                            "message": `Invalid art sub category list id! ${req.params.art_sub_category_list_id}`,
                            "data": [],
                        });
                    }
                });
            }
            res.status(201).send({
                "status": true,
                "message": "Created art sub category list!",
            });
        }
    } catch (error: any) {
        res.status(404).send({
            "status": false,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Delete art category by id
const deleteArtCategoryById = async (req: Request, res: Response) => {
    try {
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

// Delete art sub category by id
const deleteArtSubCategoryById = async (req: Request, res: Response) => {
    try {
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
                    "status": false,
                    "message": `Invalid art sub category id ${req.params.id}`,
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

// Delete art sub category list by id
const deleteArtSubCategoryListById = async (req: Request, res: Response) => {
    try {
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
        });
    } catch (error: any) {
        res.status(404).send({
            "status": true,
            "message": "Something went wrong!",
            "data": []
        });
    }
};

// Delete art sub category sub list by id
const deleteArtSubCategorySubListId = async (req: Request, res: Response) => {
    try {
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
    getArtCategoryList,
    createArtCategory,
    getArtCategoryById,
    createArtSubCategoryByArtId,
    getArtSubCategoryByIdAndSubId,
    getArtSubCategorySubList,
    createArtSubCategoryListBySubCategoryId,
    getArtSubCategorySubListById,
    createArtSubCategorySubListBySubCategoryListId,
    deleteArtCategoryById,
    deleteArtSubCategoryById,
    deleteArtSubCategoryListById,
    deleteArtSubCategorySubListId
};