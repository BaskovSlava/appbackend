"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3000;
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONNECT_204: 204,
    BadRequest_400: 400,
    NOT_FOUND_404: 404,
};
const jsonBodyMiddleware = express_1.default.json(); // json метод express
exports.app.use(jsonBodyMiddleware); // распарс body
const db = {
    courses: [
        { id: 1, title: 'frontend' },
        { id: 2, title: 'backend' },
        { id: 3, title: 'devops' },
        { id: 4, title: 'prod' },
    ],
};
exports.app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses
            .filter(course => course.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
exports.app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
});
exports.app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BadRequest_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title,
    };
    db.courses.push(createdCourse);
    res.status(exports.HTTP_STATUSES.CREATED_201).json(createdCourse);
});
exports.app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(course => course.id === +req.params.id);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONNECT_204);
});
exports.app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BadRequest_400);
        return;
    }
    const foundCourse = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(exports.HTTP_STATUSES.NO_CONNECT_204);
});
exports.app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONNECT_204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});
