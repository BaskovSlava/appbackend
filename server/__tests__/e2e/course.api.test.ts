// // import {describe} from "node:test";
import {CreateCourseModel} from "../../src/models/CreateCourseModel";

const request = require('supertest')
import {UpdateCourseModel} from "../../src/models/UpdateCourseModel";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";


const getRequest = () => {
    return request(app);
}

describe('/course', () => {

    beforeAll( async () => {
        await getRequest().delete('/__test__/data');
    }) // перед всеми тестами один раз выполни функцию

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await getRequest()
            .get('/courses/9')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't  create a new course with incorrect input data`, async () => {
        const data: CreateCourseModel = {title: ""};

        await getRequest()
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BadRequest_400)

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1: any = null;
    it(`should create a new course with correct input data`, async () => {
        const data: CreateCourseModel = {title: "New course with correct input data"};
        const createResponse =  await getRequest()
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createResponse.body;

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: data.title,
        })

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })

    let createdCourse2: any = null;
    it(`create one more course`, async () =>  {
        const data: CreateCourseModel = {title: "New course with correct input data 2"};

        const createResponse =  await getRequest()
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])

    })

    it(`shouldn't update course with incorrect input data`, async () => {
        await getRequest()
            .put('/courses/' + createdCourse1.id)
            .send({title: ""})
            .expect(HTTP_STATUSES.BadRequest_400)

        await getRequest()
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    })

    it(`shouldn't update course that not exist`, async () => {
        await getRequest()
            .put('/courses/' + -100)
            .send({title: "good title"})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should update course with correct input data`, async () => {
        const data: UpdateCourseModel = {title: "good new title"};

        await getRequest()
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONNECT_204)

        await getRequest()
            .get('/courses/'  + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: data.title,
            })

        await getRequest()
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    })

    it(`should delete both courses with correct input data`, async () => {
        await getRequest()
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONNECT_204)

        await getRequest()
            .get('/courses/'  + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .delete('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONNECT_204)

        await getRequest()
            .get('/courses/'  + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})
// объединение тестов в группу



/* Тест заглушка
describe('/course', () => {
    it(`should return 200 and empty array` , () => {
        expect(1).toBe(1);
    })
})
* */