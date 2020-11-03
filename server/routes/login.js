const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

const tableController = require('../controllers/tableController');
const cookieController = require('../controllers/cookieController');

router.get(
  '/',
  (req, res) => {
    console.log('serving login');
    res.status(200).sendFile(path.resolve(__dirname, '../../client/views/login.html'));
  },
);

router.post(
  '/',
  tableController.verifyDatabase,
  cookieController.setCookie,
  (req, res) => res.redirect('/'),
);

module.exports = router;
