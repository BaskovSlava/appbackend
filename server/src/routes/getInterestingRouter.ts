import {DBType} from "../db/db";
import express from "express";
import {RequestWithParams, RequestWithQuery} from "../types";
import {URIParamsCourseIdModels} from "../models/URIParamsCourseIdModels";
import {QueryCoursesModel} from "../models/QueryCoursesModel";

export const getInterestingRouter = (db: DBType) => {

    const router = express.Router();
    router.get('/books', (req: RequestWithQuery<QueryCoursesModel>, res) => {
        res.json({title: "it\'s books"})
    })

    router.get('/:id([0-9]+)', (req: RequestWithParams<URIParamsCourseIdModels>, res) => {
        res.json({title: "data by id" + req.params.id });
    })

    return router
}