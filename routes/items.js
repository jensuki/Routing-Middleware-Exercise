// routes for handling GET POST PATCH DELETE for shopping list

const express = require('express');
const router = new express.Router();
const items = require('../fakeDb');
const ExpressError = require('../expressError');

// GET all /items
router.get('/', (request, response, next) => {
    return response.json(items);
})

// POST /items - add a new item
router.post('/', (request, response, next) => {
    try {
        const { name, price } = request.body;
        if (!name || !price) throw new ExpressError('Name and price are required', 400);
        // otherwise
        const newItem = { name, price };
        items.push(newItem);
        return response.status(201).json({
            added: newItem
        })
    } catch (e) {
        return next(e);
    };
});

// GET /items/:name - get a specific item by name
router.get('/:name', (request, response, next) => {
    try {
        const foundItem = items.find(item => item.name === request.params.name);
        if (!foundItem) throw new ExpressError('Item not found', 404);
        return response.json({ name: foundItem.name, price: foundItem.price });
    } catch (e) {
        return next(e);
    };
});

// PATCH /items/:name - update item by name
router.patch('/:name', (request, response, next) => {
    try {
        const foundItem = items.find(item => item.name === request.params.name);
        if (!foundItem) throw new ExpressError('Item not found', 404);

        // otherwise
        const { name, price } = request.body;
        if (name) foundItem.name = name;
        if (price) foundItem.price = price;

        return response.json({ updated: foundItem })
    } catch (e) {
        return next(e);
    }
})

// DELETE /items/:name - delete an item by name
router.delete('/:name', (request, response, next) => {
    try {
        const itemIndex = items.findIndex(item => item.name == request.params.name);
        if (itemIndex === -1) throw new ExpressError('Item not found', 404);
        // otherwise remove the item at that index from the array
        items.splice(itemIndex, 1);
        return response.json({ message: 'Deleted' });
    } catch (e) {
        return next(e);
    };
});

module.exports = router;