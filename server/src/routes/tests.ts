import express from "express";
import {DBType} from "../db/db";
import {HTTP_STATUSES} from "../utils"; // импорт типа - это нормально, их нет в процессе run time


export const getTestsRouter = (db: DBType ) => {
    const router = express.Router();

    router.delete('/data', (req, res) => {
        db.courses = []; // в продакшене так делать нельзя , для текущих тестов
        res.sendStatus(HTTP_STATUSES.NO_CONNECT_204);
    })

    return router;
}