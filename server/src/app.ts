import express from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";
import {getInterestingRouter} from "./routes/getInterestingRouter";

export const app = express();

export const jsonBodyMiddleware = express.json() // json метод express


app.use(jsonBodyMiddleware); // распарс body

const coursesRouter = getCoursesRouter(db); // ооп объект, мутация, отдали объект в функцию с endpointами
const testsRouter = getTestsRouter(db);

app.use("/courses", coursesRouter);
app.use("/__test__", testsRouter);
app.use("/interesting", getInterestingRouter(db));