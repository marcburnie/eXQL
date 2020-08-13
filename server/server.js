const express = require('express');
const app = express();
const path = require('path');
const query = require("./utils/query");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieController = require("./controllers/cookieController");

const PORT = 3000;

//print current mode
console.log("Mode:", process.env.NODE_ENV)

// require routers
const tableRouter = require("./routes/tables");
const loginRouter = require("./routes/login");

//Global middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use('/table', tableRouter)
// //login route
app.use('/login', loginRouter)

//auth route
app.get('/authenticate', cookieController.setCookie, (req, res) => res.redirect('/'))
// serve index.html on the route '/'
app.get('/', cookieController.checkCookie, (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html')));
//serve static files
app.use('/', express.static(path.join(__dirname, '../dist')));

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