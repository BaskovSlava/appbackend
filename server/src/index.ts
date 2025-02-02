// import {SETTINGS} from './settings';

import express from 'express';

const app = express();
const port = 3000;

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONNECT_204: 204,
    BadRequest_400: 400,
    NOT_FOUND_404: 404,
}

const jsonBodyMiddleware = express.json() // json метод express
app.use(jsonBodyMiddleware); // распарс body

const db = {
    courses: [
        {id: 1, title: 'frontend'},
        {id: 2, title: 'backend'},
        {id: 3, title: 'devops'},
        {id: 4, title: 'prod'},
    ],
}

app.get('/courses', (req, res) => {
    let foundCourses =  db.courses;
    if(req.query.title) {
        foundCourses = foundCourses
            .filter(course => course.title.indexOf(req.query.title as string) > -1);
    }

    res.json(foundCourses);
})
app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id);
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
})
app.post('/courses', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BadRequest_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title,
    };
    db.courses.push(createdCourse)
    res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);

})
app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(course => course.id === +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONNECT_204);
})
app.put('/courses/:id', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BadRequest_400);
        return;
    }

    const foundCourse = db.courses.find(course => course.id === +req.params.id);
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    foundeCourse.title = req.body.title;

    res.sendStatus(HTTP_STATUSES.NO_CONNECT_204);
})
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
})