const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

const db = require('./models/models');
console.log(process.env.NODE_ENV)

app.use('/', express.static(path.join(__dirname, '../dist')));
// serve index.html on the route '/'
app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html')));

app.get('/test', (req, res) => {
    const queryStr = 'SELECT * FROM "people" LIMIT 100'
    db.query(queryStr)
        .then(data => {
            res.locals.table = data.rows
            res.status(200).json(res.locals.table)
        })
        .catch(err => next({
            log: `Unable to retrieve data from database. Hint: ${err.hint}`,
            message: { err: 'Unable to retrieve data' }
        }))
})


// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.sendStatus(404));

//error handler
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

// start server
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

module.exports = app;