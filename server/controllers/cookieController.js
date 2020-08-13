const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
// const tableController = require("./tableController");

const cookieController = {};

const clientCode = 'someSecretCode';

//setCookie - set a cookie from user input
cookieController.setCookie = (req, res, next) => {
    console.log("Set cookie")
    const DB_URI = req.body.url;
    jwt.sign({ DB_URI }, clientCode, (err, token) => {
        if (err) next(err)
        console.log(token)
        res.cookie('DB_URI', token, { httpOnly: true });
        return next();
    })
}

//checks if cookie exists
cookieController.checkCookie = (req, res, next) => {
    console.log("cookie", req.cookies.DB_URI)
    if (!req.cookies.DB_URI) return res.redirect('/login')
    next();
    // jwt.verify(req.cookies.DB_URI, clientCode, (err, data) => {
    //     if (err) next(err)
    //     let saved = req.user
    //     let another = res.locals
    //     app.locals.DB_URI = data.DB_URI
    //     console.log("JWT Verified", res.locals.DB_URI)
    //     next();
    // })

}

module.exports = cookieController;
