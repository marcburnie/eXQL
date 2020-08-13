const express = require("express");
const router = express.Router();

const tableController = require("../controllers/tableController");
const cookieController = require("../controllers/cookieController");

router.get('/', tableController.getDatabase, (req, res, next) => {
    console.log('index')
    res.status(200).json(res.locals.tables)

})

router.get(
    "/:table",
    cookieController.checkCookie,
    tableController.getTable,
    (req, res) => {
        return res.status(200).json(res.locals.table);
    }
);

router.put(
    "/:table", cookieController.checkCookie,
    tableController.editRows,
    (req, res) => {
        return res.status(200).json({});
    }
);

router.post(
    "/:table",
    cookieController.checkCookie,
    tableController.addRow,
    (req, res) => {
        return res.status(200).json(res.locals.addedRow);
    }
);

router.delete(
    "/:table",
    cookieController.checkCookie,
    tableController.deleteRow,
    (req, res) => {
        return res.status(200).json({});
    }
);

module.exports = router;
