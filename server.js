// set up express app to listen on port 3000

const app = require('./app')

app.listen(3000, () => {
    console.log('Server started on port 3000');
})