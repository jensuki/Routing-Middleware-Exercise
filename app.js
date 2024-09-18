// express app with middleware and registered routes

const express = require('express');
const ExpressError = require('./expressError');
const itemRoutes = require('./routes/items');

const app = express(); // initialize express app

// middleware to parse JSON request bodies
app.use(express.json());

app.use('/items', itemRoutes); // register routes wth /items prefix

// 404 handler for requests made to routes that dont exist
app.use((request, response, next) => {
    return next(new ExpressError('Not Found', 404));
});

// generic error handler - catches any errors passed into next()
app.use((err, request, response, next) => {
    let status = err.status || 500;
    let message = err.message;

    // return error response
    return response.status(status).json({
        error: { message, status }
    });
});

module.exports = app;