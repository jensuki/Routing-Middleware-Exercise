// supertests for items.js routes

process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
let items = require('../fakeDb');

beforeEach(() => {
    items.push({ name: 'popsicle', price: 1.45 });
});

afterEach(() => {
    items.length = 0 // reset the items array after each test
});

describe('GET all /items', () => {
    test('Gets all items', async () => {
        const response = await request(app)
            .get('/items')
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ name: 'popsicle', price: 1.45 }]);
    });
});

describe('POST /items', () => {
    test('Adds a new item', async () => {
        const response = await request(app)
            .post('/items')
            .send({ name: 'cookies', price: 2.50 });
        expect(response.statusCode).toBe(201);
        expect(response.body.added).toEqual({ name: 'cookies', price: 2.50 });
    });
    test('Responds with 404 if name or price is missing', async () => {
        const response = await request(app)
            .post('/items')
            .send({})
        expect(response.statusCode).toBe(400);
    });
});

describe('GET /items/:name', () => {
    test('Get a single item', async () => {
        const response = await request(app)
            .get('/items/popsicle')
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ name: 'popsicle', price: 1.45 });
    });
    test('Responds with 404 if invalid or missing item', async () => {
        const response = await request(app)
            .get('/items/nonexistent');
        expect(response.statusCode).toBe(404);
    });
});

describe('PATCH /items/:name', () => {
    test('Update a single item', async () => {
        const response = await request(app)
            .patch(`/items/${items[0].name}`)
            .send({ name: 'brownies' });
        expect(response.statusCode).toBe(200);
        expect(response.body.updated).toEqual({ name: 'brownies', price: 1.45 })
    });
    test('Responds with 404 for invalid item', async () => {
        const response = await request(app)
            .patch('/items/nonexistent')
            .send({ name: 'new popsicle' })
        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /items/:name', () => {
    test('Deletes a single item', async () => {
        const response = await request(app)
            .delete('/items/popsicle');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Deleted' });
    });
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).delete("/items/nonexistent");
        expect(res.statusCode).toBe(404);
    });
});
