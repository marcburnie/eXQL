const express = require('express');
const app = express();
const path = require('path');
const query = require("./utils/query");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = 3000;

const db = require('./models/models');
//print current mode
console.log("Mode:", process.env.NODE_ENV)

// require routers
const tableRouter = require("./routes/tables");

//Global middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use('/table', tableRouter)

app.use('/', express.static(path.join(__dirname, '../dist')));
// serve index.html on the route '/'
app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html')));

app.get("/login", (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../client/views/login.html')))
app.post("/login", (req, res) => {
    console.log(req.body)
    res.redirect("/")

})

app.get('/test', (req, res, next) => {
    const queryStr = 'SELECT * FROM "people" LIMIT 100'
    db.query(query.allTables())
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